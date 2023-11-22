// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Script} from "forge-std/Script.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";

contract DeployAccountNFT is Script {
    AccountNFT accountNft;

    function run() external {
        vm.startBroadcast();
        accountNft = new AccountNFT(0x7f4A3Fe909524CEa8C91fFdEf717C797581AE36D);
        vm.stopBroadcast();
    }
}
