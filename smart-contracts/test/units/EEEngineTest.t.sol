// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Test, console} from "forge-std/Test.sol";
import "src/erc6551/ERC6551Account.sol";
import "src/erc6551/ERC6551Registry.sol";
import "src/interfaces/IERC6551Registry.sol";
import "src/interfaces/IERC6551Account.sol";
import "src/nft/AccountNFT.sol";
import "src/nft/GameAssetsNFT.sol";
import "src/EEEngine.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract EEEngineTest is Test {
    ERC6551Account implementation;
    ERC6551Registry registry;
    AccountNFT accountNft;
    GameAssetsNFT gameAssetsNft;
    EEEngine engine;

    address owner = makeAddr("owner");
    address user1 = makeAddr("user1");

    string constant USER_NAME = "ExampleUsername";
    uint256 constant TOKEN_ACCOUNT_ID_1 = 0;
    string constant IPFS_HASH =
        "QmcRHkTHX7zAJq9aKrLBrEvWyDeuUxyvXsQ6YaEfyZ2TRA";

    function setUp() external {
        accountNft = new AccountNFT(owner);
        implementation = new ERC6551Account();
        registry = new ERC6551Registry(owner, accountNft, implementation);
        gameAssetsNft = new GameAssetsNFT(owner, IPFS_HASH);
        engine = new EEEngine(
            owner,
            address(registry),
            address(accountNft),
            address(gameAssetsNft)
        );
        vm.startPrank(owner);
        accountNft.transferOwnership(address(engine));
        registry.transferOwnership(address(engine));
        gameAssetsNft.transferOwnership(address(engine));
        vm.stopPrank();
    }

    modifier ownerAddIpfsHash() {
        vm.prank(owner);
        engine.addIpfsImageHashForAccountNft(IPFS_HASH);
        _;
    }

    // ========== Test Owner Functions =========
    function test_canAddIpfsHash() public ownerAddIpfsHash {
        string memory ipfsHash = accountNft.getIpfsImageHashById(
            TOKEN_ACCOUNT_ID_1
        );

        assertEq(ipfsHash, IPFS_HASH);
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
            ipfsImageHash: IPFS_HASH
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
                        IPFS_HASH,
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
