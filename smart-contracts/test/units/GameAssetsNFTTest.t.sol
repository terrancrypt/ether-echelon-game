// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GameAssetsNFTTest is Test {
    event IpfsHashChanged(string ifpsHash);
    event AddTokenId(uint256 tokenId);
    event AddTokenIds(uint256[] tokenIds);
    event TokenStateChanged(uint256 tokenId, bool state);

    GameAssetsNFT gameAssetsNft;

    address owner = makeAddr("owner");
    address user = makeAddr("user");

    string constant IPFS_HASH =
        "QmYyhUczuo8S4HF112aCytt8tAzjwHEjRstgCgpx7BU3Wy";
    string constant NEW_IPFS_HASH =
        "QmWGd84XZBcLeHiWr5PgxVUB9SDuqfZZAQKAAmyPiEm8BT";

    uint256 SINGLE_TOKENID = 101000;
    uint256 SINGLE_AMOUNT_TOKEN = 10;

    uint256[] MULTIPLE_TOKENID = [101000, 101001, 101002];
    uint256[] MULTIPLE_AMOUNT_TOKEN = [10, 100, 1];

    function setUp() external {
        gameAssetsNft = new GameAssetsNFT(owner, IPFS_HASH);
    }

    modifier ownerAddTokenId() {
        vm.prank(owner);
        gameAssetsNft.addSingleTokenId(SINGLE_TOKENID);
        _;
    }

    modifier ownerAddMultipleTokenIds() {
        vm.prank(owner);
        gameAssetsNft.addMultipleTokenIds(MULTIPLE_TOKENID);
        _;
    }

    modifier ownerAddTokenIdAndMintToUser() {
        vm.startPrank(owner);
        gameAssetsNft.addSingleTokenId(SINGLE_TOKENID);
        gameAssetsNft.mint(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN, "");
        vm.stopPrank();
        _;
    }

    modifier ownerAddMultipleTokenIdsAndMintToUser() {
        vm.startPrank(owner);
        gameAssetsNft.addMultipleTokenIds(MULTIPLE_TOKENID);
        gameAssetsNft.mintBatch(
            user,
            MULTIPLE_TOKENID,
            MULTIPLE_AMOUNT_TOKEN,
            ""
        );
        vm.stopPrank();
        _;
    }

    // ========== Owner Functions
    function test_revertIfNotOwner() public {
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                user
            )
        );
        gameAssetsNft.setIpfsHash(NEW_IPFS_HASH);
    }

    function test_canSetIpfsHash() public {
        vm.prank(owner);
        vm.expectEmit();
        emit GameAssetsNFT.IpfsHashChanged(NEW_IPFS_HASH);
        gameAssetsNft.setIpfsHash(NEW_IPFS_HASH);
    }

    function test_canAddSingleTokenId() public {
        vm.prank(owner);
        emit GameAssetsNFT.AddTokenId(SINGLE_TOKENID);
        gameAssetsNft.addSingleTokenId(SINGLE_TOKENID);
    }

    function test_canAddMultipleTokenIds() public {
        vm.prank(owner);
        vm.expectEmit();
        emit GameAssetsNFT.AddTokenIds(MULTIPLE_TOKENID);
        gameAssetsNft.addMultipleTokenIds(MULTIPLE_TOKENID);
    }

    function test_canUpdateTokenState() public ownerAddTokenId {
        vm.prank(owner);
        vm.expectEmit();
        emit GameAssetsNFT.TokenStateChanged(SINGLE_TOKENID, false);
        gameAssetsNft.updateTokenState(SINGLE_TOKENID, false);

        bool expectedState = gameAssetsNft.getIsTokenExists(SINGLE_TOKENID);
        assertEq(expectedState, false);
    }

    // ========== Mint Functions

    function test_revertIfTokenIdInvalid() public {
        vm.prank(owner);
        vm.expectRevert(GameAssetsNFT.TokenDoesNotExist.selector);
        gameAssetsNft.mint(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN, "");
    }

    function test_canMintNft() public ownerAddTokenId {
        vm.prank(owner);
        gameAssetsNft.mint(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN, "");
        uint256 expectedAmount = gameAssetsNft.balanceOf(user, SINGLE_TOKENID);

        assertEq(expectedAmount, SINGLE_AMOUNT_TOKEN);
    }

    function test_revertIfMultipleTokenIdsInvalid() public {
        vm.prank(owner);
        vm.expectRevert(GameAssetsNFT.TokenDoesNotExist.selector);
        gameAssetsNft.mintBatch(
            user,
            MULTIPLE_TOKENID,
            MULTIPLE_AMOUNT_TOKEN,
            ""
        );
    }

    function test_canMintBatch() public ownerAddMultipleTokenIds {
        vm.prank(owner);
        gameAssetsNft.mintBatch(
            user,
            MULTIPLE_TOKENID,
            MULTIPLE_AMOUNT_TOKEN,
            ""
        );

        for (uint256 i; i < MULTIPLE_TOKENID.length; i++) {
            uint256 tokenId = MULTIPLE_TOKENID[i];
            uint256 expectedAmount = gameAssetsNft.balanceOf(user, tokenId);

            assertEq(expectedAmount, MULTIPLE_AMOUNT_TOKEN[i]);
        }
    }

    // ========== Burn Functions ==========
    function test_canBurnGameAssetsNft() public ownerAddTokenIdAndMintToUser {
        vm.prank(user);
        gameAssetsNft.burn(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN);

        uint256 expectedAmount = gameAssetsNft.balanceOf(user, SINGLE_TOKENID);
        assertEq(expectedAmount, 0);
    }

    function test_revertBurnIfNotOwner() public ownerAddTokenIdAndMintToUser {
        vm.prank(owner);
        vm.expectRevert();
        gameAssetsNft.burn(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN);
    }

    function test_canBurnIfOwnerApproved() public ownerAddTokenIdAndMintToUser {
        vm.prank(user);
        gameAssetsNft.setApprovalForAll(owner, true);
        vm.prank(owner);
        gameAssetsNft.burn(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN);

        uint256 expectedAmount = gameAssetsNft.balanceOf(user, SINGLE_TOKENID);
        assertEq(expectedAmount, 0);
    }

    function test_revertBurnIfTokenIdIsInvalid()
        public
        ownerAddTokenIdAndMintToUser
    {
        vm.prank(owner);
        gameAssetsNft.updateTokenState(SINGLE_TOKENID, false);
        vm.prank(user);
        vm.expectRevert(GameAssetsNFT.TokenDoesNotExist.selector);
        gameAssetsNft.burn(user, SINGLE_TOKENID, SINGLE_AMOUNT_TOKEN);
    }

    function test_canBurnBatchGameAssetsNft()
        public
        ownerAddMultipleTokenIdsAndMintToUser
    {
        vm.prank(user);
        gameAssetsNft.burnBatch(user, MULTIPLE_TOKENID, MULTIPLE_AMOUNT_TOKEN);

        for (uint256 i; i < MULTIPLE_TOKENID.length; i++) {
            uint256 tokenId = MULTIPLE_TOKENID[i];
            uint256 expectedAmount = gameAssetsNft.balanceOf(user, tokenId);

            assertEq(expectedAmount, 0);
        }
    }

    function test_revertBurnBatchIfTokenIsInvalid()
        public
        ownerAddMultipleTokenIdsAndMintToUser
    {
        vm.prank(owner);
        gameAssetsNft.updateTokenState(SINGLE_TOKENID, false);

        vm.prank(user);
        vm.expectRevert(GameAssetsNFT.TokenDoesNotExist.selector);
        gameAssetsNft.burnBatch(user, MULTIPLE_TOKENID, MULTIPLE_AMOUNT_TOKEN);
    }

    // ========== TokenUri Functions
    function test_getTokenUri() public ownerAddTokenId {
        string memory actualUri = string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/",
                IPFS_HASH,
                "/",
                Strings.toString(SINGLE_TOKENID),
                ".json"
            )
        );

        string memory expectedUri = gameAssetsNft.uri(SINGLE_TOKENID);

        assertEq(actualUri, expectedUri);
    }

    function test_getContractUri() public ownerAddTokenId {
        string memory actualUri = string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/",
                IPFS_HASH,
                "/",
                "metadata.json"
            )
        );

        string memory expectedUri = gameAssetsNft.contractURI();

        assertEq(actualUri, expectedUri);
    }
}
