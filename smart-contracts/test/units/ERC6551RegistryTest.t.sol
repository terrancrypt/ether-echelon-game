// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.21;

// import {Test, console} from "forge-std/Test.sol";
// import {ERC6551Registry} from "src/erc6551/ERC6551Registry.sol";
// import {AccountNFT} from "src/nft/AccountNFT.sol";
// import {ERC6551Account} from "src/erc6551/ERC6551Account.sol";

// contract ERC6551RegistryTest is Test {
//     event AccountCreated(
//         address account,
//         address implementation,
//         uint256 chainId,
//         address tokenContract,
//         uint256 tokenId,
//         uint256 salt
//     );

//     // struct AccountInfor {
//     //     string userName;
//     //     string imageUri;
//     // }

//     ERC6551Registry registry;
//     ERC6551Account account;
//     AccountNFT token;

//     address owner = makeAddr("owner");
//     address user = makeAddr("user");

//     function setUp() external {
//         account = new ERC6551Account();
//         token = new AccountNFT(owner);
//         registry = new ERC6551Registry(owner, token, account);
//     }

//     function test_canCreateAccount() public {
//         vm.startPrank(user);
//         AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
//             username: "user1",
//             ipfsImageHash: "testHashHere"
//         });
//         token.mintNFT(user, accInfo);
//         registry.createAccount(block.chainid, address(token), 0, 0, "");
//         vm.stopPrank();
//     }

//     function test_RevertIfTokenNotAllowed() public {
//         AccountNFT anotherToken = new AccountNFT(owner);
//         AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
//             username: "user1",
//             ipfsImageHash: "testHashHere"
//         });
//         vm.startPrank(user);
//         anotherToken.mintNFT(user, accInfo);
//         vm.expectRevert(ERC6551Registry.TokenNotAllowed.selector);
//         registry.createAccount(block.chainid, address(anotherToken), 0, 0, "");
//         vm.stopPrank();
//     }
// }
