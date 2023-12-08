// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {IERC6551Account} from "../interfaces/IERC6551Account.sol";
import {MinimalReceiver} from "../lib/MinimalReceiver.sol";
import {ERC6551AccountLib} from "../lib/ERC6551AccountLib.sol";

contract ERC6551Account is
    IERC165,
    IERC1271,
    IERC6551Account,
    IERC1155Receiver
{
    error ERC6511Account_AccessDenied();
    error ERC6511Account_InsufficientBalance();

    using SafeERC20 for IERC20;

    uint256 public nonce;

    receive() external payable {}

    ///////////////////////////////
    // ========== Events ==========
    ///////////////////////////////
    event ERC20Transferred(address indexed to, uint256 amount);
    event ERC1155Transferred(
        address indexed tokenAddress,
        uint256 indexed tokenId,
        address indexed to,
        uint256 amount
    );
    event ERC1155ApprovedForAll(address operator, bool approved);

    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(msg.sender == owner(), "Not token owner");

        ++nonce;

        emit TransactionExecuted(to, value, data);

        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function token() external view returns (uint256, address, uint256) {
        return ERC6551AccountLib.token();
    }

    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this
            .token();
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId);
    }

    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) external view returns (bytes4 magicValue) {
        bool isValid = SignatureChecker.isValidSignatureNow(
            owner(),
            hash,
            signature
        );

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    ////////////////////////////////////////
    // ========== ERC20 Functions ==========
    ////////////////////////////////////////
    function safeTransferERC20(
        address to,
        address tokenAddress,
        uint256 amount
    ) public {
        if (msg.sender != owner()) {
            revert ERC6511Account_AccessDenied();
        }
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        if (amount < balance) {
            revert ERC6511Account_InsufficientBalance();
        }

        IERC20(tokenAddress).safeTransfer(to, amount);
        emit ERC20Transferred(to, amount);
    }

    ////////////////////////////////////////
    // ========== ERC1155 Functions ==========
    ////////////////////////////////////////
    function transferERC1551(
        address to,
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public {
        if (msg.sender != owner()) {
            revert ERC6511Account_AccessDenied();
        }

        uint256 balance = IERC1155(tokenAddress).balanceOf(
            address(this),
            tokenId
        );

        if (amount < balance) {
            revert ERC6511Account_InsufficientBalance();
        }

        IERC1155(tokenAddress).safeTransferFrom(
            address(this),
            to,
            tokenId,
            amount,
            data
        );

        emit ERC1155Transferred(tokenAddress, tokenId, to, amount);
    }

    function safeApproveERC1155(
        address tokenAddress,
        address operator,
        bool approved
    ) public {
        if (msg.sender != owner()) {
            revert ERC6511Account_AccessDenied();
        }

        IERC1155(tokenAddress).setApprovalForAll(operator, approved);

        emit ERC1155ApprovedForAll(operator, approved);
    }
}
