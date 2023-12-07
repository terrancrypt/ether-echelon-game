// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title Ether Echelon Token Contract
/// @author Terrancrypt
/// @notice This contract is just an example contract to mint a utility token for users to buy items in the Ether Echelon game. There will definitely be changes in the future.
contract EEG is ERC20, ERC20Permit {
    constructor()
        ERC20("Ether Echelon Token", "EEG")
        ERC20Permit("Ether Echelon Token")
    {}

    uint256 constant FAUCET_AMOUNT = 100e18;

    function faucet() public {
        super._mint(msg.sender, FAUCET_AMOUNT);
    }
}
