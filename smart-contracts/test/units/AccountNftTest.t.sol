// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract AccountNftTest is Test {
    event UserNameUpdated(uint256 indexed tokenId, string newUserName);

    AccountNFT token;

    address owner = makeAddr("owner");
    address user = makeAddr("user");

    // Variables
    string USER_NAME = "exampleUserName";
    string IPFS_HASH = "exampleHashHere";

    function setUp() external {
        token = new AccountNFT(owner);
    }

    modifier mintNftToUser() {
        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: USER_NAME,
            ipfsImageHash: IPFS_HASH
        });

        vm.startPrank(owner);
        token.addIpfsImageHash(IPFS_HASH);
        token.mintNFT(user, accInfo);
        vm.stopPrank();
        _;
    }

    function test_canMintNFT() public {
        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: USER_NAME,
            ipfsImageHash: IPFS_HASH
        });

        vm.startPrank(owner);
        token.addIpfsImageHash(IPFS_HASH);
        uint256 tokenId = token.mintNFT(user, accInfo);
        vm.stopPrank();

        uint256 balanceOfUser = token.balanceOf(user);

        assertEq(balanceOfUser, 1);
        assertEq(tokenId, 0);
    }

    function test_revertIfExceedLength() public {
        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: "exampleUserName1",
            ipfsImageHash: IPFS_HASH
        });

        vm.expectRevert(AccountNFT.AccountNFT_ExceededLength.selector);
        vm.prank(owner);
        token.mintNFT(user, accInfo);
    }

    function test_revertIfUsernameAlreadyExists() public mintNftToUser {
        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: USER_NAME,
            ipfsImageHash: IPFS_HASH
        });

        vm.prank(owner);
        vm.expectRevert(AccountNFT.AccountNFT_UsernameAlreadyExists.selector);
        token.mintNFT(user, accInfo);
    }

    function test_revertIfImageHashInvalid() public {
        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: USER_NAME,
            ipfsImageHash: "exampleInvalidHash"
        });

        vm.startPrank(owner);
        token.addIpfsImageHash(IPFS_HASH);
        vm.expectRevert(AccountNFT.AccountNFT_InvalidIpfsHash.selector);
        token.mintNFT(user, accInfo);
        vm.stopPrank();
    }

    function test_revertIfNotTokenOwner() public mintNftToUser {
        vm.expectRevert(AccountNFT.AccountNFT_InvalidOwner.selector);
        token.updateUserName(0, "exampleUser");
    }

    function test_revertIfExceedLengthWhenUpdate() public mintNftToUser {
        vm.prank(user);
        vm.expectRevert(AccountNFT.AccountNFT_ExceededLength.selector);
        token.updateUserName(0, "exampleUsernameExceedLenght");
    }

    function test_canUpdateUserName() public mintNftToUser {
        vm.prank(user);
        vm.expectEmit();
        emit AccountNFT.UserNameUpdated(0, "userNameUpdated");
        token.updateUserName(0, "userNameUpdated");
    }

    function test_canAddIfpsImageHash() public {
        vm.prank(owner);
        token.addIpfsImageHash(IPFS_HASH);

        string memory expectedHash = token.getIpfsImageHashById(0);

        assertEq(IPFS_HASH, expectedHash);
    }
}
