// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Script} from "forge-std/Script.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";

contract DeployAccountNFT is Script {
    AccountNFT accountNft;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        vm.stopBroadcast();
    }
}
