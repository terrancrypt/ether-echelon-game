// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";

contract AccountNftTest is Test {
    AccountNFT token;

    address owner = makeAddr("owner");
    address user = makeAddr("user");

    function setUp() external {
        token = new AccountNFT(owner, "");
    }

    function test_canMintNFT() public {
        token.mintNFT(user);

        uint256 balanceOfUser = token.balanceOf(user);

        assertEq(balanceOfUser, 1);
    }
}
