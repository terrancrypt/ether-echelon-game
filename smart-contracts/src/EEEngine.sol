// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {AccountNFT} from "src/nft/AccountNFT.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {IERC6551Registry} from "src/interfaces/IERC6551Registry.sol";

/// @title Eche Echelon Engine Contract
/// @author Terrancrypt
/// @notice This Contract Engine inherits from all other contracts in the Ether Echelon Game application to run everything centrally into a single contract for both owner and user. This only supports hackathons and there will definitely be changes in the future.
contract EEEngine is Ownable {
    error EEEngine__AddressAlreadyExists();

    IERC6551Registry private immutable i_erc6551Registry;
    AccountNFT private immutable i_account;
    GameAssetsNFT private immutable i_gameAssets;

    uint256 private constant STARTER_BEASTS_ID = 0;

    mapping(uint256 tokenId => address erc6551Address)
        private s_tokenIdToAddress;

    constructor(
        address initialOwner,
        address erc6551Registry,
        address accountNftAddress,
        address gameAssetsAddress
    ) Ownable(initialOwner) {
        i_erc6551Registry = IERC6551Registry(erc6551Registry);
        i_account = AccountNFT(accountNftAddress);
        i_gameAssets = GameAssetsNFT(gameAssetsAddress);
    }

    ///////////////////////////////////////////////////
    // ========== Owner's Function Inherited ==========
    ///////////////////////////////////////////////////

    function addIpfsImageHashForAccountNft(
        string memory _ipfsImageHash
    ) public onlyOwner {
        i_account.addIpfsImageHash(_ipfsImageHash);
    }

    function setUpIfpsHashForGameAssets(
        string memory _ipfsHash
    ) public onlyOwner {
        i_gameAssets.setIpfsHash(_ipfsHash);
    }

    function addSingleTokenIdForGameAssets(uint256 _tokenId) public onlyOwner {
        i_gameAssets.addSingleTokenId(_tokenId);
    }

    function addMultipleTokenIdsGameAssets(
        uint256[] calldata _tokenIds
    ) public onlyOwner {
        i_gameAssets.addMultipleTokenIds(_tokenIds);
    }

    function updateTokenStateInGameAssets(
        uint256 _tokenId,
        bool _state
    ) public onlyOwner {
        i_gameAssets.updateTokenState(_tokenId, _state);
    }

    /// @notice Mint an account nft and create address for it
    /// @dev functions i_account.mintNft() and i_erc6551Registry.createAccount() can only be called in this contract. This ensures each AccountNFT can only generate a single address, ensuring game consistency.
    function createAccount(
        AccountNFT.AccountInfor calldata _accountInfor
    ) public returns (address) {
        uint256 accountId = i_account.mintNFT(msg.sender, _accountInfor);

        address accountAddr = i_erc6551Registry.createAccount(
            block.chainid,
            address(i_account),
            accountId,
            block.number,
            ""
        );

        i_account.updateAddrForAccount(accountId, accountAddr);

        s_tokenIdToAddress[accountId] = accountAddr;

        return accountAddr;
    }

    function _mintGameAssets(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) internal {
        i_gameAssets.mint(to, tokenId, amount, data);
    }
}
