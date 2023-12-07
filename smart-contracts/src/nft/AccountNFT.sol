// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract AccountNFT is ERC721, Ownable {
    error AccountNFT_ExceededLength();
    error AccountNFT_UsernameAlreadyExists();
    error AccountNFT_InvalidOwner();
    error AccountNFT_InvalidIpfsHash();
    error AccountNFT_ImageHashAlreadyExists();

    struct AccountInfor {
        string username;
        string ipfsImageHash;
    }
    mapping(uint256 tokenId => AccountInfor) private s_tokenInfo;
    uint256 private s_tokenCounter;
    mapping(uint256 tokenId => address accountAddr) public s_tokenIdToAddr;

    mapping(string ipfsImageHash => bool isExists) private s_isImageHash;
    mapping(uint256 imageHashId => string ipfsImageHash)
        private s_ipfsImageHash;
    uint256 private s_currentImageHash;

    mapping(string username => bool isExists) private s_isUsername;

    constructor(
        address initialOwner
    ) ERC721("Ether Echelon Account", "EEA") Ownable(initialOwner) {}

    event AccountNftMinted(address indexed owner, uint256 tokenId);
    event UserNameUpdated(uint256 indexed tokenId, string newUsername);

    //////////////////////////////////////////
    // ========== Owner's Functions ==========
    //////////////////////////////////////////
    function addIpfsImageHash(string memory _ipfsImageHash) external onlyOwner {
        if (s_isImageHash[_ipfsImageHash] == true) {
            revert AccountNFT_ImageHashAlreadyExists();
        }
        s_ipfsImageHash[s_currentImageHash] = _ipfsImageHash;
        s_isImageHash[_ipfsImageHash] = true;
        s_currentImageHash++;
    }

    function updateAddrForAccount(
        uint256 _tokenId,
        address _accountAddr
    ) external onlyOwner {
        s_tokenIdToAddr[_tokenId] = _accountAddr;
    }

    //////////////////////////////////////////
    // ========== Public Functions ===========
    //////////////////////////////////////////
    function updateUserName(uint256 tokenId, string memory newUsername) public {
        if (_ownerOf(tokenId) != msg.sender) {
            revert AccountNFT_InvalidOwner();
        }
        if (bytes(newUsername).length > 15 || bytes(newUsername).length < 5) {
            revert AccountNFT_ExceededLength();
        }
        if (s_isUsername[newUsername] == true) {
            revert AccountNFT_UsernameAlreadyExists();
        }

        s_tokenInfo[tokenId].username = newUsername;

        string memory pastUsername = s_tokenInfo[tokenId].username;

        s_isUsername[newUsername] = true;
        s_isUsername[pastUsername] = false;

        emit UserNameUpdated(tokenId, newUsername);
    }

    ///////////////////////////////////////////
    // ========== External Functions ==========
    ///////////////////////////////////////////
    function mintNFT(
        address _owner,
        AccountInfor calldata _accountInfor
    ) external onlyOwner returns (uint256 tokenId) {
        string memory userName = _accountInfor.username;
        if (bytes(userName).length > 15 || bytes(userName).length < 5) {
            revert AccountNFT_ExceededLength();
        }
        if (s_isUsername[userName] == true) {
            revert AccountNFT_UsernameAlreadyExists();
        }
        if (s_isImageHash[_accountInfor.ipfsImageHash] == false) {
            revert AccountNFT_InvalidIpfsHash();
        }
        _safeMint(_owner, s_tokenCounter);
        tokenId = s_tokenCounter;
        s_tokenInfo[tokenId] = AccountInfor({
            username: userName,
            ipfsImageHash: _accountInfor.ipfsImageHash
        });
        s_tokenCounter++;
        s_isUsername[userName] = true;

        emit AccountNftMinted(_owner, tokenId);
    }

    ///////////////////////////////////////////////////////
    // ========== Public View / Getter Functions ==========
    ///////////////////////////////////////////////////////
    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        string memory username = s_tokenInfo[tokenId].username;
        string memory ipfsImageHash = s_tokenInfo[tokenId].ipfsImageHash;
        string memory accountAddr = Strings.toHexString(
            uint256(uint160(s_tokenIdToAddr[tokenId])),
            20
        );

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        abi.encodePacked(
                            '{"name": "',
                            name(),
                            '", "image": "https://ipfs.io/ipfs/',
                            ipfsImageHash,
                            '", "userName": "',
                            username,
                            '", "accountAddr": "',
                            accountAddr,
                            '"}'
                        )
                    )
                )
            );
    }

    function getCurrentTokenCount() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getIpfsImageHashById(
        uint256 _imageHashId
    ) public view returns (string memory) {
        return s_ipfsImageHash[_imageHashId];
    }

    function getIpfsImageHashes() public view returns (string[] memory) {
        string[] memory arrIpfsHash = new string[](s_currentImageHash);

        for (uint256 i = 0; i < s_currentImageHash; i++) {
            arrIpfsHash[i] = s_ipfsImageHash[i];
        }

        return arrIpfsHash;
    }
}
