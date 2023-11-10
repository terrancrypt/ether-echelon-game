// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract AccountNFT is ERC721, Ownable {
    error AccountNFT_ExceededLength();
    error AccountNFT_InvalidOwner();
    error AccountNFT_InvalidIpfsHash();
    error AccountNFT_ImageHashAlreadyExists();

    uint256 private s_tokenCounter;

    struct AccountInfor {
        string userName;
        string ipfsImageHash;
    }

    mapping(uint256 tokenId => AccountInfor) private s_tokenInfo;

    mapping(string ipfsImageHash => bool isExists) private s_isImageHash;

    mapping(uint256 imageHashId => string ipfsImageHash)
        private s_ipfsImageHash;
    uint256 private s_currentImageHash;

    constructor(
        address initialOwner
    ) ERC721("Ether Echelon Account", "EEA") Ownable(initialOwner) {}

    event UserNameUpdated(uint256 indexed tokenId, string newUserName);

    function mintNFT(
        address _owner,
        AccountInfor calldata _accountInfor
    ) external onlyOwner returns (uint256 tokenId) {
        if (bytes(_accountInfor.userName).length > 15) {
            revert AccountNFT_ExceededLength();
        }
        if (s_isImageHash[_accountInfor.ipfsImageHash] == false) {
            revert AccountNFT_InvalidIpfsHash();
        }
        _safeMint(_owner, s_tokenCounter);
        tokenId = s_tokenCounter;
        s_tokenInfo[tokenId] = AccountInfor({
            userName: _accountInfor.userName,
            ipfsImageHash: _accountInfor.ipfsImageHash
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
        string memory ipfsImageHash = s_tokenInfo[tokenId].ipfsImageHash;
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "',
                                name(),
                                '", "image": "https://ipfs.io/ipfs/',
                                ipfsImageHash,
                                '", "userName": "',
                                userName,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function updateUserName(uint256 tokenId, string memory newUserName) public {
        if (_ownerOf(tokenId) != msg.sender) {
            revert AccountNFT_InvalidOwner();
        }
        if (bytes(newUserName).length > 15) {
            revert AccountNFT_ExceededLength();
        }

        s_tokenInfo[tokenId].userName = newUserName;

        emit UserNameUpdated(tokenId, newUserName);
    }

    function addIpfsImageHash(string memory _ipfsImageHash) external onlyOwner {
        if (s_isImageHash[_ipfsImageHash] == true) {
            revert AccountNFT_ImageHashAlreadyExists();
        }
        s_ipfsImageHash[s_currentImageHash] = _ipfsImageHash;
        s_isImageHash[_ipfsImageHash] = true;
        s_currentImageHash++;
    }

    // ========== Getter Functions =========
    function getIpfsImageHash(
        uint256 _imageHashId
    ) public view returns (string memory) {
        return s_ipfsImageHash[_imageHashId];
    }

    function getIpfsImageHash() public view returns (string[] memory) {
        string[] memory arrIpfsHash = new string[](s_currentImageHash);

        for (uint256 i = 0; i < s_currentImageHash; i++) {
            arrIpfsHash[i] = s_ipfsImageHash[i];
        }

        return arrIpfsHash;
    }
}
