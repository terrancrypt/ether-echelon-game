// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Script} from "forge-std/Script.sol";
import {EEEngine} from "src/EEEngine.sol";
import {ERC6551Registry} from "src/erc6551/ERC6551Registry.sol";
import {ERC6551Account} from "src/erc6551/ERC6551Account.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";

contract DeployEEEngine is Script {
    address owner = 0x7f4A3Fe909524CEa8C91fFdEf717C797581AE36D;
    bytes32 public constant ENGINE_CONTRACT_ROLE =
        keccak256("ENGINE_CONTRACT_ROLE");

    EEEngine engine;
    ERC6551Account erc6551Account;
    ERC6551Registry erc6551Registry;
    AccountNFT accountNft;
    GameAssetsNFT gameAssetsNft;

    function run() external {
        vm.startBroadcast();
        accountNft = new AccountNFT(owner);
        erc6551Account = new ERC6551Account();
        erc6551Registry = new ERC6551Registry(
            owner,
            accountNft,
            erc6551Account
        );
        gameAssetsNft = new GameAssetsNFT(owner, "");
        engine = new EEEngine(
            owner,
            address(erc6551Registry),
            address(accountNft),
            address(gameAssetsNft)
        );

        accountNft.transferOwnership(address(engine));
        erc6551Registry.transferOwnership(address(engine));
        gameAssetsNft.transferOwnership(address(engine));
        vm.stopBroadcast();
    }
}
