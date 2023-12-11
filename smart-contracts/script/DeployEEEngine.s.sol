// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Script} from "forge-std/Script.sol";
import {EEEngine} from "src/EEEngine.sol";
import {ERC6551Registry} from "src/erc6551/ERC6551Registry.sol";
import {ERC6551Account} from "src/erc6551/ERC6551Account.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";
import {EEG} from "src/token/EEG.sol";

contract DeployEEEngine is Script {
    address owner = 0x7f4A3Fe909524CEa8C91fFdEf717C797581AE36D;
    bytes32 public constant ENGINE_CONTRACT_ROLE =
        keccak256("ENGINE_CONTRACT_ROLE");

    EEEngine engine;
    ERC6551Account erc6551Account;
    ERC6551Registry erc6551Registry;
    AccountNFT accountNft;
    GameAssetsNFT gameAssetsNft;
    EEG eEToken;

    uint64 vrfSubscriptionId = 6663;
    address vrfCoordinatorMumbai = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    bytes32 vrfKeyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 vrfCallbackGasLimit = 1000000;

    function run() external {
        vm.startBroadcast();
        // Deploy contract
        accountNft = new AccountNFT(owner);
        erc6551Account = new ERC6551Account();
        erc6551Registry = new ERC6551Registry(
            owner,
            accountNft,
            erc6551Account
        );
        gameAssetsNft = new GameAssetsNFT(owner, "");
        eEToken = new EEG();
        engine = new EEEngine(
            owner,
            address(erc6551Registry),
            address(accountNft),
            address(gameAssetsNft),
            address(eEToken),
            vrfSubscriptionId,
            vrfCoordinatorMumbai,
            vrfKeyHash,
            vrfCallbackGasLimit
        );

        accountNft.transferOwnership(address(engine));
        erc6551Registry.transferOwnership(address(engine));
        gameAssetsNft.transferOwnership(address(engine));

        vm.stopBroadcast();
    }
}
