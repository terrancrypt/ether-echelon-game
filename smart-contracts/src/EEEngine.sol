// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {AccountNFT} from "src/nft/AccountNFT.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {IERC6551Registry} from "src/interfaces/IERC6551Registry.sol";

contract EEEngine is Ownable {
    error EEEngine__AddressAlreadyExists();

    IERC6551Registry private immutable i_erc6551Registry;
    AccountNFT private immutable i_account;
    GameAssetsNFT private immutable i_beasts;
    GameAssetsNFT private immutable i_EECoin;
    GameAssetsNFT private immutable i_chests;

    uint256 private constant STARTER_BEASTS_ID = 0;

    mapping(uint256 tokenId => address erc6551Address)
        private s_tokenIdToAddress;

    constructor(
        address initialOwner,
        address erc6551Registry,
        address accountNft,
        address beastsNft,
        address eeCoin,
        address chestsNft
    ) Ownable(initialOwner) {
        i_erc6551Registry = IERC6551Registry(erc6551Registry);
        i_account = AccountNFT(accountNft);
        i_beasts = GameAssetsNFT(beastsNft);
        i_EECoin = GameAssetsNFT(eeCoin);
        i_chests = GameAssetsNFT(chestsNft);
    }

    // ========== Owner Functions ==========
    function addIpfsImageHash(string memory _ipfsImageHash) public onlyOwner {
        i_account.addIpfsImageHash(_ipfsImageHash);
    }

    /// @notice Mint an account nft and create address for it
    /// @dev functions i_account.mintNft() and i_erc6551Registry.createAccount() can only be called in this contract. This ensures each AccountNFT can only generate a single address, ensuring game consistency.
    /// @param _accountInfor includes 2 parameters, `username` (customized by the user) no shorter than 5 characters and no longer than 15 characters. `ipfsImageHash` is predefined which ipfsImageHash will represent the game character. Maybe this will change in the future where ipfsImageHash can let users change their avatars or sell avatar icon packs in the game, then the AccountInfor struct will have an additional parameter, characterName.
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

        s_tokenIdToAddress[_tokenId] = accountAddr;

        return accountAddr;
    }

    function _mintGameAssetsNft(
        address to,
        address tokenAddr,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) internal {
        GameAssetsNFT(tokenAddr).mint(to, tokenId, amount, data);
    }
}
