// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.21;

// import {Test, console} from "forge-std/Test.sol";
// import "src/erc6551/ERC6551Account.sol";
// import "src/erc6551/ERC6551Registry.sol";
// import "src/interfaces/IERC6551Registry.sol";
// import "src/interfaces/IERC6551Account.sol";
// import "src/nft/AccountNFT.sol";
// import "src/nft/GameAssetsNFT.sol";
// import "src/EEEngine.sol";

// contract EEEngineTest is Test {
//     ERC6551Account implementation;
//     ERC6551Registry registry;
//     AccountNFT accountNft;
//     GameAssetsNFT beastsNft;
//     GameAssetsNFT chestsNft;
//     GameAssetsNFT eeCoinNft;
//     EEEngine engine;

//     address owner = makeAddr("owner");
//     address user1 = makeAddr("user1");

//     uint256 constant USER1_ACC_NFT_MINTED_ID = 0;

//     string constant IPFS_HASH =
//         "QmcRHkTHX7zAJq9aKrLBrEvWyDeuUxyvXsQ6YaEfyZ2TRA";

//     function setUp() external {
//         accountNft = new AccountNFT(owner);
//         implementation = new ERC6551Account();
//         registry = new ERC6551Registry(owner, accountNft, implementation);
//         beastsNft = new GameAssetsNFT(owner, IPFS_HASH);
//         chestsNft = new GameAssetsNFT(owner, IPFS_HASH);
//         eeCoinNft = new GameAssetsNFT(owner, IPFS_HASH);
//         engine = new EEEngine(
//             owner,
//             address(registry),
//             address(accountNft),
//             address(beastsNft),
//             address(eeCoinNft),
//             address(chestsNft)
//         );
//         vm.startPrank(owner);
//         accountNft.transferOwnership(address(engine));
//         registry.transferOwnership(address(engine));
//         beastsNft.transferOwnership(address(engine));
//         chestsNft.transferOwnership(address(engine));
//         eeCoinNft.transferOwnership(address(engine));
//         vm.stopPrank();
//     }

//     function test_canMintAccountNft() public {
//         vm.prank(user1);
//         uint256 actualId = engine.mintAccountNft();

//         address expectedUser = accountNft.ownerOf(actualId);
//         assertEq(user1, expectedUser);
//         assertEq(actualId, USER1_ACC_NFT_MINTED_ID);
//     }

//     function test_canCreateAccountByNft() public {
//         _userAccountNftMinted();
//         vm.prank(user1);
//         address payable actualAddr = engine.createAccountByNft(
//             USER1_ACC_NFT_MINTED_ID,
//             1,
//             ""
//         );
//         address expectedAddr = registry.account(
//             address(implementation),
//             block.chainid,
//             address(accountNft),
//             USER1_ACC_NFT_MINTED_ID,
//             1
//         );
//         (, address tokenContract, uint256 tokenId) = IERC6551Account(actualAddr)
//             .token();
//         address expectedOwner = IERC6551Account(actualAddr).owner();

//         assertEq(actualAddr, expectedAddr);
//         assertEq(tokenContract, address(accountNft));
//         assertEq(USER1_ACC_NFT_MINTED_ID, tokenId);
//         assertEq(user1, expectedOwner);
//     }

//     // function test_canMintGameAssetsNftToAccountAddress() public {
//     //     _userAccountNftMinted();

//     //     uint256 tokenId = 0;
//     //     uint256 amountMint = 10;
//     //     address payable accountAddr = _userAccountCreated();
//     //     vm.prank(user1);
//     //     engine.mintGameAssetsNft(
//     //         accountAddr,
//     //         address(beastsNft),
//     //         tokenId,
//     //         amountMint,
//     //         ""
//     //     );

//     //     uint256 actualBalance = beastsNft.balanceOf(accountAddr, tokenId);

//     //     assertEq(amountMint, actualBalance);
//     // }

//     function _userAccountNftMinted() internal {
//         vm.prank(user1);
//         engine.mintAccountNft();
//     }

//     function _userAccountCreated() internal returns (address payable) {
//         vm.prank(user1);
//         address accountAddr = engine.createAccountByNft(
//             USER1_ACC_NFT_MINTED_ID,
//             block.number,
//             ""
//         );
//         return payable(accountAddr);
//     }
// }
