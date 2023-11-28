// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.21;

// import {Test, console} from "forge-std/Test.sol";
// import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";

// contract GameAssetsNFTTest is Test {
//     // Contracts
//     GameAssetsNFT nftContract;

//     // Inviduals
//     address owner = makeAddr("owner");
//     address user1 = makeAddr("user1");
//     address user2 = makeAddr("user2");

//     // TokenId
//     uint256 constant TOKEN_1 = 0;
//     uint256 constant TOKEN_2 = 1;

//     uint256 AMOUNT_MINT_TOKEN_1 = 10;
//     uint256 AMOUNT_MINT_TOKEN_2 = 100;

//     function setUp() external {
//         nftContract = new GameAssetsNFT(
//             owner,
//             "QmcRHkTHX7zAJq9aKrLBrEvWyDeuUxyvXsQ6YaEfyZ2TRA"
//         );
//     }

//     // ========== Modifier ==========
//     modifier mintTokenToAllUser() {
//         uint256[] memory arrToken = new uint256[](2);
//         uint256[] memory arrAmount = new uint256[](2);
//         arrToken[0] = TOKEN_1;
//         arrToken[1] = TOKEN_2;
//         arrAmount[0] = AMOUNT_MINT_TOKEN_1;
//         arrAmount[1] = AMOUNT_MINT_TOKEN_2;
//         vm.startPrank(owner);
//         nftContract.mintBatch(user1, arrToken, arrAmount, "");
//         nftContract.mintBatch(user2, arrToken, arrAmount, "");
//         vm.stopPrank();
//         _;
//     }

//     // ========== Test Mint ==========
//     function test_canMintNft() public {
//         uint256 amountMint = 1;
//         vm.prank(owner);
//         nftContract.mint(user1, TOKEN_1, amountMint, "");

//         uint256 userBalance = nftContract.balanceOf(user1, TOKEN_1);
//         assertEq(amountMint, userBalance);
//     }

//     function test_canMintBatch() public {
//         uint256[] memory arrToken = new uint256[](2);
//         uint256[] memory arrAmount = new uint256[](2);

//         arrToken[0] = TOKEN_1;
//         arrToken[1] = TOKEN_2;

//         arrAmount[0] = AMOUNT_MINT_TOKEN_1;
//         arrAmount[1] = AMOUNT_MINT_TOKEN_2;

//         vm.startPrank(owner);
//         nftContract.mintBatch(user1, arrToken, arrAmount, "");
//         vm.stopPrank();

//         uint256 userBalance1 = nftContract.balanceOf(user1, TOKEN_1);
//         uint256 userBalance2 = nftContract.balanceOf(user1, TOKEN_2);

//         assertEq(userBalance1, AMOUNT_MINT_TOKEN_1);
//         assertEq(userBalance2, AMOUNT_MINT_TOKEN_2);
//     }

//     // ========== Test URI ==========
//     function test_CanGetTokenUri() public mintTokenToAllUser {
//         string
//             memory expectedUri = "https://ipfs.io/ipfs/QmcRHkTHX7zAJq9aKrLBrEvWyDeuUxyvXsQ6YaEfyZ2TRA/0.json";

//         string memory actualUri = nftContract.uri(TOKEN_1);

//         assertEq(expectedUri, actualUri);
//     }

//     function test_CanGetContractUri() public mintTokenToAllUser {
//         string
//             memory expectedUri = "https://ipfs.io/ipfs/QmcRHkTHX7zAJq9aKrLBrEvWyDeuUxyvXsQ6YaEfyZ2TRA/metadata.json";

//         string memory actualUri = nftContract.contractURI();

//         assertEq(expectedUri, actualUri);
//     }
// }
