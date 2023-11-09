// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract AccountNFT is ERC721, Ownable {
    uint256 private s_tokenCounter;

    struct AccountInfo {
        string userName;
        string imageUri;
    }

    mapping(uint256 tokenId => AccountInfo) private s_tokenInfo;

    constructor(
        address initialOwner
    ) ERC721("Ether Echelon Account", "EEA") Ownable(initialOwner) {}

    function mintNFT(
        address _owner,
        AccountInfo calldata _accountInfo
    ) external onlyOwner returns (uint256 tokenId) {
        _safeMint(_owner, s_tokenCounter);
        tokenId = s_tokenCounter;
        s_tokenInfo[tokenId] = AccountInfo({
            userName: _accountInfo.userName,
            imageUri: _accountInfo.imageUri
        });
        s_tokenCounter++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        string memory userName = s_tokenInfo[tokenId].userName;
        string memory imageURI = s_tokenInfo[tokenId].imageUri;
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "',
                                name(),
                                '", "image": "',
                                imageURI,
                                '", "userName": "',
                                userName,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
