// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.21;

// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// import {AccountNFT} from "src/nft/AccountNFT.sol";
// import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
// import {IERC6551Registry} from "src/interfaces/IERC6551Registry.sol";

// contract EEEngine is Ownable {
//     error EEEngine__AddressAlreadyExists();

//     IERC6551Registry private immutable i_erc6551Registry;
//     AccountNFT private immutable i_account;
//     GameAssetsNFT private immutable i_beasts;
//     GameAssetsNFT private immutable i_EECoin;
//     GameAssetsNFT private immutable i_chests;

//     uint256 private constant STARTER_BEASTS_ID = 0;

//     mapping(uint256 tokenId => address erc6551Address)
//         private s_tokenIdToAddress;
//     mapping(uint256 tokenId => bool isHaveAddress) private s_isTokenHaveAddress;

//     constructor(
//         address initialOwner,
//         address erc6551Registry,
//         address accountNft,
//         address beastsNft,
//         address eeCoin,
//         address chestsNft
//     ) Ownable(initialOwner) {
//         i_erc6551Registry = IERC6551Registry(erc6551Registry);
//         i_account = AccountNFT(accountNft);
//         i_beasts = GameAssetsNFT(beastsNft);
//         i_EECoin = GameAssetsNFT(eeCoin);
//         i_chests = GameAssetsNFT(chestsNft);
//     }

//     // Starter kit for new player in game
//     function createAccountAndMintNft() public {
//         uint256 accountId = i_account.mintNFT(msg.sender);

//         address accountAddr = i_erc6551Registry.createAccount(
//             block.chainid,
//             address(i_account),
//             accountId,
//             block.number,
//             ""
//         );

//         i_beasts.mint(accountAddr, STARTER_BEASTS_ID, 1, "");
//     }

//     function mintAccountNft() public returns (uint256) {
//         uint256 accountId = i_account.mintNFT(msg.sender);
//         return accountId;
//     }

//     function createAccountByNft(
//         uint256 _tokenId,
//         uint256 _salt,
//         bytes calldata _initData
//     ) public returns (address payable) {
//         if (s_isTokenHaveAddress[_tokenId] == true) {
//             revert EEEngine__AddressAlreadyExists();
//         }

//         address accountAddr = i_erc6551Registry.createAccount(
//             block.chainid,
//             address(i_account),
//             _tokenId,
//             _salt,
//             _initData
//         );

//         s_tokenIdToAddress[_tokenId] = accountAddr;

//         return payable(accountAddr);
//     }

//     function _mintGameAssetsNft(
//         address to,
//         address tokenAddr,
//         uint256 tokenId,
//         uint256 amount,
//         bytes memory data
//     ) internal {
//         GameAssetsNFT(tokenAddr).mint(to, tokenId, amount, data);
//     }
// }
