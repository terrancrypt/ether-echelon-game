// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GameAssetsNFT is ERC1155, Ownable, ERC1155Burnable {
    error TokenDoesNotExist();

    string private s_ipfsHash;

    mapping(uint256 tokenId => bool) private s_isTokenExists;

    constructor(
        address initialOwner,
        string memory ipfsHash
    ) ERC1155("") Ownable(initialOwner) {
        s_ipfsHash = ipfsHash;
    }

    event IpfsHashChanged(string ifpsHash);
    event AddTokenId(uint256 tokenId);
    event AddTokenIds(uint256[] tokenIds);
    event TokenStateChanged(uint256 tokenId, bool state);

    ///////////////////////////////////////
    // ========== Owner Function ==========
    ///////////////////////////////////////

    /// @dev Update Ipfs Hash for dynamic NFTs, game balance or possible updates
    function setIpfsHash(string memory newIpfsHash) public onlyOwner {
        s_ipfsHash = newIpfsHash;
        emit IpfsHashChanged(newIpfsHash);
    }

    function addSingleTokenId(uint256 _tokenId) external onlyOwner {
        s_isTokenExists[_tokenId] = true;
        emit AddTokenId(_tokenId);
    }

    function addMultipleTokenIds(
        uint256[] calldata _tokenIds
    ) external onlyOwner {
        for (uint256 i; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            s_isTokenExists[tokenId] = true;
        }
        emit AddTokenIds(_tokenIds);
    }

    function updateTokenState(
        uint256 _tokenId,
        bool _state
    ) external onlyOwner {
        s_isTokenExists[_tokenId] = _state;
        emit TokenStateChanged(_tokenId, _state);
    }

    ////////////////////////////////////////////////
    // ========== External Mint Functions ==========
    ////////////////////////////////////////////////

    function mint(
        address account,
        uint256 _tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        if (s_isTokenExists[_tokenId] == false) {
            revert TokenDoesNotExist();
        }
        _mint(account, _tokenId, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        for (uint256 i; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            if (s_isTokenExists[tokenId] == false) {
                revert TokenDoesNotExist();
            }
        }
        _mintBatch(to, tokenIds, amounts, data);
    }

    ////////////////////////////////////////////////
    // ========== External Burn Functions ==========
    ////////////////////////////////////////////////

    function burn(
        address account,
        uint256 _tokenId,
        uint256 amount
    ) public override {
        if (s_isTokenExists[_tokenId] == false) {
            revert TokenDoesNotExist();
        }
        super.burn(account, _tokenId, amount);
    }

    function burnBatch(
        address account,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) public override {
        for (uint256 i; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            if (s_isTokenExists[tokenId] == false) {
                revert TokenDoesNotExist();
            }
        }
        super.burnBatch(account, tokenIds, amounts);
    }

    //////////////////////////////////////
    // ========== URI Functions ==========
    //////////////////////////////////////

    /// @notice Override uri function to provide token-specific metadata
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

    /// @notice Provide URI for the entire contract
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

    ///////////////////////////////////////////////////////
    // ========== Public View / Getter Functions ==========
    ///////////////////////////////////////////////////////
    function getIsTokenExists(uint256 _tokenId) public view returns (bool) {
        return s_isTokenExists[_tokenId];
    }
}
