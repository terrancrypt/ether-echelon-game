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
    address user2 = makeAddr("user2");

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

    // Ether Echelon ERC20 Token
    uint256 constant FAUCET_AMOUNT = 100e18;

    // Incubate Infor
    uint256 constant HATCHING_TIME = 3600; //in miliseconds

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

    modifier ownerAddIpfsHashForAccountNft() {
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

    modifier ownerSetBeastEvolve() {
        vm.prank(owner);
        engine.setBeastEvolveInfor(101000, 101001, 101003);
        _;
    }

    // ========== Test Owner Functions =========
    function test_revertAddImageIfNotOwner() public {
        vm.expectRevert();
        engine.addIpfsImageHashForAccountNft(IPFS_HASH_ACCOUNT);
    }

    function test_canAddIpfsHashForAccount()
        public
        ownerAddIpfsHashForAccountNft
    {
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

    function test_canSetBeastEvolveInfor() public ownerAddMultipleGameAssetId {
        vm.prank(owner);
        engine.setBeastEvolveInfor(101000, 101001, 101003);

        EEEngine.EvolveInfor memory evolveInfor = engine.getBeastEnvolveInfor(
            101000
        );

        assertTrue(evolveInfor.evolutionable);
        assertEq(evolveInfor.evolveToBeastId, 101001);
        assertEq(evolveInfor.conditionAssetId, 101003);
    }

    function test_canSetEggIncubateInfor() public ownerAddMultipleGameAssetId {
        vm.prank(owner);
        engine.setEggIncubateInfor(101000, 101001, HATCHING_TIME);

        EEEngine.IncubateInfor memory incubateInfor = engine
            .getEggIncubateInfor(101000);

        assertEq(incubateInfor.hatchingTime, HATCHING_TIME);
        assertEq(incubateInfor.incubateToBeastId, 101001);
    }

    // ========== Test Create Account ==========
    function test_canCreateAccountInEngine()
        public
        ownerAddIpfsHashForAccountNft
    {
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

        address ownerOfAccount = ERC6551Account(payable(actualAccountAddr))
            .owner();

        assertEq(user1, ownerOfAccount);
        assertEq(expectedAccountAddr, actualAccountAddr);
        assertEq(expectedTokenUri, actualTokenUri);
    }

    function test_transferAccountOwnerAndTransferToken() public {
        _ownerAllSetupForMintAssets();
        vm.startPrank(user1);
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1);
        address accountAddr = _userCreateAnAccountNft();
        engine.mintGameAssets(accountAddr, TOKEN_ID_GAME_ASSETS, 1);
        accountNft.safeTransferFrom(user1, user2, TOKEN_ACCOUNT_ID_1);
        vm.stopPrank();

        address ownerOfAccount = ERC6551Account(payable(accountAddr)).owner();
        assertEq(user2, ownerOfAccount);

        vm.prank(user2);
        ERC6551Account(payable(accountAddr)).transferERC1551(
            user1,
            address(gameAssetsNft),
            TOKEN_ID_GAME_ASSETS,
            1,
            ""
        );

        uint256 balanceOfAccount = gameAssetsNft.balanceOf(
            accountAddr,
            TOKEN_ID_GAME_ASSETS
        );
        uint256 balanceOfUser1 = gameAssetsNft.balanceOf(
            user1,
            TOKEN_ID_GAME_ASSETS
        );

        assertEq(balanceOfAccount, 0);
        assertEq(balanceOfUser1, 1);
    }

    // ========== Game Assets Minting & Transfer Test =========
    function test_userCanMintGameAssets() public {
        _ownerAllSetupForMintAssets();

        vm.startPrank(user1);
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1);
        address accountAddr = _userCreateAnAccountNft();
        engine.mintGameAssets(accountAddr, TOKEN_ID_GAME_ASSETS, 1);
        vm.stopPrank();

        uint256 expectedBalance = gameAssetsNft.balanceOf(
            accountAddr,
            TOKEN_ID_GAME_ASSETS
        );

        assertEq(expectedBalance, 1);

        uint256 remainEEGAmount = etherEchelonToken.balanceOf(user1);

        assertEq(remainEEGAmount, FAUCET_AMOUNT - GAME_ASSETS_PRICE_1);
    }

    function test_userCanTransferERC1155FromAccount() public {
        _ownerAllSetupForMintAssets();
        vm.startPrank(user1);
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1);
        address accountAddr = _userCreateAnAccountNft();
        engine.mintGameAssets(accountAddr, TOKEN_ID_GAME_ASSETS, 1);

        ERC6551Account(payable(accountAddr)).transferERC1551(
            user2,
            address(gameAssetsNft),
            TOKEN_ID_GAME_ASSETS,
            1,
            ""
        );
        vm.stopPrank();

        uint256 balanceOfAccount = gameAssetsNft.balanceOf(
            accountAddr,
            TOKEN_ID_GAME_ASSETS
        );
        uint256 balanceOfUser2 = gameAssetsNft.balanceOf(
            user2,
            TOKEN_ID_GAME_ASSETS
        );

        assertEq(balanceOfAccount, 0);
        assertEq(balanceOfUser2, 1);
    }

    // ========== Beasts Envolve Test ==========
    function test_userCanEvolveBeast() public {
        _ownerAllSetupForEvolveBeast();
        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1 * 2);
        engine.mintGameAssets(accountAddr, TOKEN_ID_GAME_ASSETS, 1);
        engine.mintGameAssets(accountAddr, 101003, 1);
        ERC6551Account(payable(accountAddr)).safeApproveERC1155(
            address(gameAssetsNft),
            address(engine),
            true
        );
        engine.evolveBeast(accountAddr, 101000);
        vm.stopPrank();

        uint256 beastForEvolveBalance = gameAssetsNft.balanceOf(
            accountAddr,
            TOKEN_ID_GAME_ASSETS
        );

        assertEq(beastForEvolveBalance, 0);

        uint256 beastReceivedAfterEvolve = gameAssetsNft.balanceOf(
            accountAddr,
            101001
        );

        assertEq(beastReceivedAfterEvolve, 1);

        uint256 conditionAssetBalance = gameAssetsNft.balanceOf(
            accountAddr,
            101003
        );

        assertEq(conditionAssetBalance, 0);
    }

    function test_revertBeastEvolveIfTokenInvalid()
        public
        ownerAddIpfsHashForAccountNft
    {
        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        vm.expectRevert(EEEngine.EEEngine_TokenIdInvalid.selector);
        engine.evolveBeast(accountAddr, 101000);
        vm.stopPrank();
    }

    function test_revertBeastEvolveIfInsufficientBalance() public {
        _ownerAllSetupForEvolveBeast();
        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        vm.expectRevert(EEEngine.EEEngine_InsufficientBalance.selector);
        engine.evolveBeast(accountAddr, 101000);
        vm.stopPrank();
    }

    // ========== Egg Incubate Test ==========
    function test_canIncubateAnEgg()
        public
        ownerAddIpfsHashForAccountNft
        ownerAddMultipleGameAssetId
    {
        uint256 eggIdForIncubate = 101000;
        vm.startPrank(owner);
        engine.setEggIncubateInfor(eggIdForIncubate, 101001, HATCHING_TIME);
        engine.setGameAssetPrice(eggIdForIncubate, GAME_ASSETS_PRICE_1);
        vm.stopPrank();

        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1);
        engine.mintGameAssets(accountAddr, eggIdForIncubate, 1);
        ERC6551Account(payable(accountAddr)).safeApproveERC1155(
            address(gameAssetsNft),
            address(engine),
            true
        );
        vm.warp(1641070800);
        engine.incubateAnEgg(accountAddr, eggIdForIncubate);
        vm.stopPrank();

        uint256 eggBalanceOfAccount = gameAssetsNft.balanceOf(
            accountAddr,
            eggIdForIncubate
        );

        assertEq(eggBalanceOfAccount, 0);

        uint256 eggBalanceInEngine = gameAssetsNft.balanceOf(
            address(engine),
            eggIdForIncubate
        );

        assertEq(eggBalanceInEngine, 1);

        uint256 startTime = engine.getEggIncubatedStartTime(
            accountAddr,
            eggIdForIncubate
        );

        assertEq(startTime, 1641070800);
    }

    function test_canHatchEgg()
        public
        ownerAddIpfsHashForAccountNft
        ownerAddMultipleGameAssetId
    {
        uint256 eggIdForIncubate = 101000;
        vm.startPrank(owner);
        engine.setEggIncubateInfor(eggIdForIncubate, 101001, HATCHING_TIME);
        engine.setGameAssetPrice(eggIdForIncubate, GAME_ASSETS_PRICE_1);
        vm.stopPrank();

        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1);
        engine.mintGameAssets(accountAddr, eggIdForIncubate, 1);
        ERC6551Account(payable(accountAddr)).safeApproveERC1155(
            address(gameAssetsNft),
            address(engine),
            true
        );
        vm.warp(1641070800);
        vm.roll(100);
        engine.incubateAnEgg(accountAddr, eggIdForIncubate);
        vm.warp(1641070800 + HATCHING_TIME);
        vm.roll(100);
        engine.hatchEgg(accountAddr, eggIdForIncubate);
        vm.stopPrank();

        uint256 eggBalanceInEngine = gameAssetsNft.balanceOf(
            address(engine),
            eggIdForIncubate
        );

        assertEq(eggBalanceInEngine, 0);

        EEEngine.IncubateInfor memory incubateInfor = engine
            .getEggIncubateInfor(eggIdForIncubate);

        uint256 beastBalanceInAccount = gameAssetsNft.balanceOf(
            accountAddr,
            incubateInfor.incubateToBeastId
        );

        assertEq(beastBalanceInAccount, 1);
    }

    function test_revertIncubateEggIfEggIdInvalid() public {
        vm.prank(user1);
        vm.expectRevert(EEEngine.EEEngine_TokenIdInvalid.selector);
        engine.incubateAnEgg(user1, 101000);
    }

    function test_revertIncubateEggIfTokenIdNotEgg()
        public
        ownerAddIpfsHashForAccountNft
        ownerAddMultipleGameAssetId
    {
        vm.prank(user1);
        vm.expectRevert(EEEngine.EEEngine_NotAnEgg.selector);
        engine.incubateAnEgg(user1, 101001);
    }

    function test_revertIncubateEggIfBalanceEggInvalid()
        public
        ownerAddIpfsHashForAccountNft
        ownerAddMultipleGameAssetId
    {
        uint256 eggIdForIncubate = 101000;
        vm.startPrank(owner);
        engine.setEggIncubateInfor(eggIdForIncubate, 101001, HATCHING_TIME);
        engine.setGameAssetPrice(eggIdForIncubate, GAME_ASSETS_PRICE_1);
        vm.stopPrank();

        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        ERC6551Account(payable(accountAddr)).safeApproveERC1155(
            address(gameAssetsNft),
            address(engine),
            true
        );
        vm.expectRevert(EEEngine.EEEngine_InsufficientBalance.selector);
        engine.incubateAnEgg(user1, eggIdForIncubate);
        vm.stopPrank();
    }

    function test_revertHatchEggIfNotEnoughTime()
        public
        ownerAddIpfsHashForAccountNft
        ownerAddMultipleGameAssetId
    {
        uint256 eggIdForIncubate = 101000;
        vm.startPrank(owner);
        engine.setEggIncubateInfor(eggIdForIncubate, 101001, HATCHING_TIME);
        engine.setGameAssetPrice(eggIdForIncubate, GAME_ASSETS_PRICE_1);
        vm.stopPrank();

        vm.startPrank(user1);
        address accountAddr = _userCreateAnAccountNft();
        etherEchelonToken.faucet();
        etherEchelonToken.approve(address(engine), GAME_ASSETS_PRICE_1);
        engine.mintGameAssets(accountAddr, eggIdForIncubate, 1);
        ERC6551Account(payable(accountAddr)).safeApproveERC1155(
            address(gameAssetsNft),
            address(engine),
            true
        );
        vm.warp(1641070800);
        vm.roll(100);
        engine.incubateAnEgg(accountAddr, eggIdForIncubate);
        vm.warp(1641070800 + 1300);
        vm.roll(50);
        vm.expectRevert(EEEngine.EEEngine_EggCannotHatch.selector);
        engine.hatchEgg(accountAddr, eggIdForIncubate);
        vm.stopPrank();
    }

    // ========== Helper Internal Test Functions =========
    function _ownerAllSetupForMintAssets() internal {
        vm.startPrank(owner);
        engine.addIpfsImageHashForAccountNft(IPFS_HASH_ACCOUNT);
        engine.addSingleTokenIdForGameAssets(TOKEN_ID_GAME_ASSETS);
        engine.setGameAssetPrice(TOKEN_ID_GAME_ASSETS, GAME_ASSETS_PRICE_1);
        vm.stopPrank();
    }

    function _ownerAllSetupForEvolveBeast() internal {
        vm.startPrank(owner);
        engine.addIpfsImageHashForAccountNft(IPFS_HASH_ACCOUNT);
        engine.addMultipleTokenIdsGameAssets(MULTI_TOKEN_ID_GAME_ASSETS);
        engine.setGameAssetPrice(101000, GAME_ASSETS_PRICE_1);
        engine.setGameAssetPrice(101003, GAME_ASSETS_PRICE_1);
        engine.setBeastEvolveInfor(101000, 101001, 101003);
        vm.stopPrank();
    }

    function _userCreateAnAccountNft() internal returns (address) {
        AccountNFT.AccountInfor memory accInfo = AccountNFT.AccountInfor({
            username: USER_NAME,
            ipfsImageHash: IPFS_HASH_ACCOUNT
        });
        address accountAddr = engine.createAccount(accInfo);
        return accountAddr;
    }
}
