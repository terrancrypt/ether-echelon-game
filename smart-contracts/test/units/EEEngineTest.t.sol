// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "src/erc6551/ERC6551Account.sol";
import "src/erc6551/ERC6551Registry.sol";
import "src/interfaces/IERC6551Registry.sol";
import "src/interfaces/IERC6551Account.sol";
import "src/nft/AccountNFT.sol";
import "src/nft/GameAssetsNFT.sol";
import "src/EEEngine.sol";
import "src/token/EEG.sol";

contract EEEngineTest is Test {
    ERC6551Account implementation;
    ERC6551Registry registry;
    AccountNFT accountNft;
    GameAssetsNFT gameAssetsNft;
    EEEngine engine;
    EEG etherEchelonToken;

    address owner = makeAddr("owner");
    address user1 = makeAddr("user1");

    string constant USER_NAME = "ExampleUsername";
    uint256 constant TOKEN_ACCOUNT_ID_1 = 0;
    string constant IPFS_HASH_ACCOUNT =
        "QmcRHkTHX7zAJq9aKrLBrEvWyDeuUxyvXsQ6YaEfyZ2TRA";
    string constant IPFS_HASH_ASSETS = "ExampleHash";

    // Token Game Assets
    uint256 constant TOKEN_ID_GAME_ASSETS = 101000;
    uint256[] MULTI_TOKEN_ID_GAME_ASSETS = [101000, 101001, 101003];
    uint256 constant GAME_ASSETS_PRICE_1 = 10e18;
    uint256[] MULTI_GAME_ASSETS_PRICE = [10e18, 20e18, 100e18];

    function setUp() external {
        accountNft = new AccountNFT(owner);
        implementation = new ERC6551Account();
        registry = new ERC6551Registry(owner, accountNft, implementation);
        gameAssetsNft = new GameAssetsNFT(owner, IPFS_HASH_ASSETS);
        etherEchelonToken = new EEG();
        engine = new EEEngine(
            owner,
            address(registry),
            address(accountNft),
            address(gameAssetsNft),
            address(etherEchelonToken)
        );
        vm.startPrank(owner);
        accountNft.transferOwnership(address(engine));
        registry.transferOwnership(address(engine));
        gameAssetsNft.transferOwnership(address(engine));
        vm.stopPrank();
    }

    modifier ownerAddIpfsHash() {
        vm.prank(owner);
        engine.addIpfsImageHashForAccountNft(IPFS_HASH_ACCOUNT);
        _;
    }

    modifier ownerAddGameAssetId() {
        vm.prank(owner);
        engine.addSingleTokenIdForGameAssets(TOKEN_ID_GAME_ASSETS);
        _;
    }

    modifier ownerAddMultipleGameAssetId() {
        vm.prank(owner);
        engine.addMultipleTokenIdsGameAssets(MULTI_TOKEN_ID_GAME_ASSETS);
        _;
    }

    // ========== Test Owner Functions =========
    function test_revertAddImageIfNotOwner() public {
        vm.expectRevert();
        engine.addIpfsImageHashForAccountNft(IPFS_HASH_ACCOUNT);
    }

    function test_canAddIpfsHashForAccount() public ownerAddIpfsHash {
        string memory ipfsHash = accountNft.getIpfsImageHashById(
            TOKEN_ACCOUNT_ID_1
        );

        assertEq(ipfsHash, IPFS_HASH_ACCOUNT);
    }

    function test_canSetUpIfpsHashForGameAssets() public {
        vm.prank(owner);
        engine.setUpIfpsHashForGameAssets(IPFS_HASH_ASSETS);

        string memory expectedUri = string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/",
                IPFS_HASH_ASSETS,
                "/",
                "metadata.json"
            )
        );

        string memory actualUri = gameAssetsNft.contractURI();
        assertEq(expectedUri, actualUri);
    }

    function test_canAddSingleTokenIdForGameAssets() public {
        vm.prank(owner);
        engine.addSingleTokenIdForGameAssets(TOKEN_ID_GAME_ASSETS);

        bool checkTokenExists = gameAssetsNft.getIsTokenExists(
            TOKEN_ID_GAME_ASSETS
        );

        assertEq(checkTokenExists, true);
    }

    function test_canAddMultipleTokenIdsGameAssets() public {
        vm.prank(owner);
        engine.addMultipleTokenIdsGameAssets(MULTI_TOKEN_ID_GAME_ASSETS);

        for (uint256 i; i < MULTI_TOKEN_ID_GAME_ASSETS.length; i++) {
            uint256 tokenId = MULTI_TOKEN_ID_GAME_ASSETS[i];

            bool checkTokenExists = gameAssetsNft.getIsTokenExists(tokenId);
            assertEq(checkTokenExists, true);
        }
    }

    function test_canSetGameAssetPrice() public ownerAddGameAssetId {
        vm.prank(owner);
        engine.setGameAssetPrice(TOKEN_ID_GAME_ASSETS, GAME_ASSETS_PRICE_1);

        uint256 expectedPrice = engine.getGameAssetPrice(TOKEN_ID_GAME_ASSETS);

        assertEq(expectedPrice, GAME_ASSETS_PRICE_1);
    }

    function test_canSetMultipleGameAssetPrice()
        public
        ownerAddMultipleGameAssetId
    {
        vm.prank(owner);
        engine.setMultipleGameAssetPrice(
            MULTI_TOKEN_ID_GAME_ASSETS,
            MULTI_GAME_ASSETS_PRICE
        );

        (uint256[] memory tokenIds, uint256[] memory prices) = engine
            .getMultipleGameAssetsPrices(MULTI_TOKEN_ID_GAME_ASSETS);

        assertEq(MULTI_TOKEN_ID_GAME_ASSETS, tokenIds);
        assertEq(MULTI_GAME_ASSETS_PRICE, prices);
    }

    // ========== Test Create Account ==========
    function test_canCreateAccountInEngine() public ownerAddIpfsHash {
        address expectedAccountAddr = registry.account(
            address(implementation),
            block.chainid,
            address(accountNft),
            TOKEN_ACCOUNT_ID_1,
            1
        );

        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: USER_NAME,
            ipfsImageHash: IPFS_HASH_ACCOUNT
        });

        vm.prank(user1);
        address actualAccountAddr = engine.createAccount(accInfo);

        string memory tokenName = accountNft.name();
        string memory actualAccountAddrToString = Strings.toHexString(
            uint256(uint160(actualAccountAddr)),
            20
        );

        string memory expectedTokenUri = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    abi.encodePacked(
                        '{"name": "',
                        tokenName,
                        '", "image": "https://ipfs.io/ipfs/',
                        IPFS_HASH_ACCOUNT,
                        '", "userName": "',
                        USER_NAME,
                        '", "accountAddr": "',
                        actualAccountAddrToString,
                        '"}'
                    )
                )
            )
        );

        string memory actualTokenUri = accountNft.tokenURI(TOKEN_ACCOUNT_ID_1);

        assertEq(expectedAccountAddr, actualAccountAddr);
        assertEq(expectedTokenUri, actualTokenUri);
    }

    // function test_canCreateAccountByNft() public {
    //     _userAccountNftMinted();
    //     vm.prank(user1);
    //     address payable actualAddr = engine.createAccountByNft(
    //         USER1_ACC_NFT_MINTED_ID,
    //         1,
    //         ""
    //     );
    //     address expectedAddr = registry.account(
    //         address(implementation),
    //         block.chainid,
    //         address(accountNft),
    //         USER1_ACC_NFT_MINTED_ID,
    //         1
    //     );
    //     (, address tokenContract, uint256 tokenId) = IERC6551Account(actualAddr)
    //         .token();
    //     address expectedOwner = IERC6551Account(actualAddr).owner();

    //     assertEq(actualAddr, expectedAddr);
    //     assertEq(tokenContract, address(accountNft));
    //     assertEq(USER1_ACC_NFT_MINTED_ID, tokenId);
    //     assertEq(user1, expectedOwner);
    // }

    // function test_canMintGameAssetsNftToAccountAddress() public {
    //     _userAccountNftMinted();

    //     uint256 tokenId = 0;
    //     uint256 amountMint = 10;
    //     address payable accountAddr = _userAccountCreated();
    //     vm.prank(user1);
    //     engine.mintGameAssetsNft(
    //         accountAddr,
    //         address(beastsNft),
    //         tokenId,
    //         amountMint,
    //         ""
    //     );

    //     uint256 actualBalance = beastsNft.balanceOf(accountAddr, tokenId);

    //     assertEq(amountMint, actualBalance);
    // }

    // function _userAccountNftMinted() internal {
    //     vm.prank(user1);
    //     engine.mintAccountNft();
    // }

    // function _userAccountCreated() internal returns (address payable) {
    //     vm.prank(user1);
    //     address accountAddr = engine.createAccountByNft(
    //         USER1_ACC_NFT_MINTED_ID,
    //         block.number,
    //         ""
    //     );
    //     return payable(accountAddr);
    // }
}
