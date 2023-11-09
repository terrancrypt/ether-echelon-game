// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GameAssetsNFT is ERC1155, Ownable, ERC1155Burnable {
    string private s_ipfsHash;

    constructor(
        address initialOwner,
        string memory ipfsHash
    ) ERC1155("") Ownable(initialOwner) {
        s_ipfsHash = ipfsHash;
    }

    // ========== Mint Functions ==========
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // ========== URI Functions ==========
    // Override uri function to provide token-specific metadata
    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://ipfs.io/ipfs/",
                    s_ipfsHash,
                    "/",
                    Strings.toString(_tokenId),
                    ".json"
                )
            );
    }

    // Provide URI for the entire contract
    function contractURI() public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://ipfs.io/ipfs/",
                    s_ipfsHash,
                    "/",
                    "metadata.json"
                )
            );
    }

    // Update Ipfs Hash for dynamic NFTs, game balance or possible updates
    function setIpfsHash(string memory newIpfsHash) public onlyOwner {
        s_ipfsHash = newIpfsHash;
    }
}
