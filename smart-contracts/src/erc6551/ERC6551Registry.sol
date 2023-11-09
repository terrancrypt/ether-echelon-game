// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {IERC6551Registry} from "../interfaces/IERC6551Registry.sol";
import {AccountNFT} from "../nft/AccountNFT.sol";
import {ERC6551Account} from "./ERC6551Account.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ERC6551Registry is IERC6551Registry, Ownable {
    error InitializationFailed();
    error TokenNotAllowed();

    address private immutable i_implementation;
    address private immutable i_accountNFT;

    constructor(
        address initialOwner,
        AccountNFT _accountNftAddress,
        ERC6551Account _implementation
    ) Ownable(initialOwner) {
        i_accountNFT = address(_accountNftAddress);
        i_implementation = address(_implementation);
    }

    function createAccount(
        // address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external onlyOwner returns (address) {
        if (tokenContract != i_accountNFT) {
            revert TokenNotAllowed();
        }

        bytes memory code = _creationCode(
            i_implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        address _account = Create2.computeAddress(
            bytes32(salt),
            keccak256(code)
        );

        if (_account.code.length != 0) return _account;

        _account = Create2.deploy(0, bytes32(salt), code);

        if (initData.length != 0) {
            (bool success, ) = _account.call(initData);
            if (!success) revert InitializationFailed();
        }

        emit AccountCreated(
            _account,
            i_implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        return _account;
    }

    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address) {
        bytes32 bytecodeHash = keccak256(
            _creationCode(implementation, chainId, tokenContract, tokenId, salt)
        );

        return Create2.computeAddress(bytes32(salt), bytecodeHash);
    }

    function _creationCode(
        address implementation_,
        uint256 chainId_,
        address tokenContract_,
        uint256 tokenId_,
        uint256 salt_
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
                implementation_,
                hex"5af43d82803e903d91602b57fd5bf3",
                abi.encode(salt_, chainId_, tokenContract_, tokenId_)
            );
    }
}
