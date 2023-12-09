// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {AccountNFT} from "src/nft/AccountNFT.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {IERC6551Registry} from "src/interfaces/IERC6551Registry.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {EEG} from "src/token/EEG.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Eche Echelon Engine Contract
/// @author Terrancrypt
/// @notice This Contract Engine inherits from all other contracts in the Ether Echelon Game application to run everything centrally into a single contract for both owner and user. This only supports hackathons and there will definitely be changes in the future.
contract EEEngine is Ownable, IERC165, IERC1155Receiver {
    using SafeERC20 for EEG;

    error EEEngine_AddressAlreadyExists();
    error EEEngine_TokenIdInvalid();
    error EEEngine_InputNotMatchLength();
    error EEEngine_TokenPriceHasNotSet();
    error EEEngine_InsufficientBalance();
    error EEEngine_BeastCannotEvolve();
    error EEEngine_NotAnEgg();
    error EEEngine_EggAlreadyIncubated();
    error EEEngine_EggNotIncubate();
    error EEEngine_EggCannotHatch();

    IERC6551Registry private immutable i_erc6551Registry;
    AccountNFT private immutable i_account;
    GameAssetsNFT private immutable i_gameAssets;
    EEG private immutable i_etherEchelonToken;

    mapping(uint256 tokenId => address erc6551Address)
        private s_tokenIdToAddress;

    /// @dev This variable helps store the Id token of the game Assets corresponding to its pre-stored value.
    mapping(uint256 gameAssetsId => uint256 price) private s_tokenToPrice;

    /// @dev This variable checks whether the tokenId of a Game Assets NFT has the owner set a price for it? Without this variable the user can mint an NFT that has not yet had a price set.
    mapping(uint256 gameAssetsId => bool hasSetPrice)
        private s_tokenHasSetPrice;

    /// @dev This variable identifies a chestId (gameAssetId) that can be burned and randomly selects one of any openable items in the chest.
    /// @notice "102000": "NormalChest", "102001": "RareChest", "102002": "EpicChest"
    struct ChestInfor {
        uint256 quantityInOne;
        uint256 numberCanBeOpen;
        mapping(uint256 numberCanBeOpen => uint256 gameAssetsId) gameAssetAccepted;
    }
    mapping(uint256 chestId => ChestInfor) private s_chestIdToInfor;

    /// @dev This variable allows the evolution of EtherBeast in the game. If you want to evolve from beasts A to beast B, you must have a conditional NFT item (evolution stone). When burning Beast A and NFT conditions, you will receive Beast B - beast A's evolution item.
    struct EvolveInfor {
        bool evolutionable;
        uint256 evolveToBeastId;
        uint256 conditionAssetId;
    }
    mapping(uint256 beastId => EvolveInfor) private s_beastIdToEvolveInfor;

    /// @dev This variable helps determine what kind of beast an egg (gameAssetsNft) can be staked and hatch into in the future.
    struct IncubateInfor {
        uint256 hatchingTime;
        uint256 incubateToBeastId;
    }
    mapping(uint256 eggId => IncubateInfor) private s_eggToIncubateInfor;
    mapping(address account => mapping(uint256 eggId => bool isIncubated))
        private s_isEggIncubated;
    mapping(address account => mapping(uint256 eggId => uint256 incubationTimeStart))
        private s_incubatedInfor;

    mapping(uint256 tokenId => bool isEgg) private s_isEgg;

    ////////////////////////////////////
    // ========== Constructor ==========
    ////////////////////////////////////
    constructor(
        address initialOwner,
        address erc6551Registry,
        address accountNftAddress,
        address gameAssetsAddress,
        address etherEchelonToken
    ) Ownable(initialOwner) {
        i_erc6551Registry = IERC6551Registry(erc6551Registry);
        i_account = AccountNFT(accountNftAddress);
        i_gameAssets = GameAssetsNFT(gameAssetsAddress);
        i_etherEchelonToken = EEG(etherEchelonToken);
    }

    ///////////////////////////////
    // ========== Events ==========
    ///////////////////////////////
    event GameAssetPriceChanged(uint256 indexed tokenId, uint256 price);
    event MultipleGameAssetPriceChanged(uint256[] tokenIds, uint256[] prices);
    event BeastEvolveInforSetted(
        uint256 beastId,
        uint256 toBeastId,
        uint256 conditionId
    );
    event EggIncubateInforSetted(
        uint256 indexed eggId,
        uint256 indexed incubateToBeastId,
        uint256 hatchingTime
    );
    event BeastEvolved(uint256 indexed fromBeastId, uint256 indexed toBeastId);
    event EggIncubated(
        address account,
        uint256 indexed eggId,
        uint256 timeStart
    );
    event EggHatched(
        address indexed account,
        uint256 indexed eggId,
        uint256 indexed beastId
    );

    ///////////////////////////////////////////////////
    // ========== Owner's Function Inherited ==========
    ///////////////////////////////////////////////////

    function addIpfsImageHashForAccountNft(
        string memory _ipfsImageHash
    ) public onlyOwner {
        i_account.addIpfsImageHash(_ipfsImageHash);
    }

    function setUpIfpsHashForGameAssets(
        string memory _ipfsHash
    ) public onlyOwner {
        i_gameAssets.setIpfsHash(_ipfsHash);
    }

    function addSingleTokenIdForGameAssets(uint256 _tokenId) public onlyOwner {
        i_gameAssets.addSingleTokenId(_tokenId);
    }

    function addMultipleTokenIdsGameAssets(
        uint256[] calldata _tokenIds
    ) public onlyOwner {
        i_gameAssets.addMultipleTokenIds(_tokenIds);
    }

    function updateTokenStateInGameAssets(
        uint256 _tokenId,
        bool _state
    ) public onlyOwner {
        i_gameAssets.updateTokenState(_tokenId, _state);
    }

    function setGameAssetPrice(
        uint256 _tokenId,
        uint256 price
    ) public onlyOwner {
        bool isTokenExists = i_gameAssets.getIsTokenExists(_tokenId);
        if (!isTokenExists) {
            revert EEEngine_TokenIdInvalid();
        }

        s_tokenToPrice[_tokenId] = price;
        s_tokenHasSetPrice[_tokenId] = true;

        emit GameAssetPriceChanged(_tokenId, price);
    }

    function setMultipleGameAssetPrice(
        uint256[] calldata _tokenIds,
        uint256[] calldata prices
    ) public onlyOwner {
        if (_tokenIds.length != prices.length) {
            revert EEEngine_InputNotMatchLength();
        }

        for (uint256 i; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];

            bool isTokenExists = i_gameAssets.getIsTokenExists(tokenId);
            if (!isTokenExists) {
                revert EEEngine_TokenIdInvalid();
            }

            s_tokenToPrice[tokenId] = prices[i];
            s_tokenHasSetPrice[tokenId] = true;
        }

        emit MultipleGameAssetPriceChanged(_tokenIds, prices);
    }

    function setBeastEvolveInfor(
        uint256 _beastTokenId,
        uint256 _envolveToId,
        uint256 conditionAssetId
    ) public onlyOwner {
        bool isBeastIdExists = i_gameAssets.getIsTokenExists(_beastTokenId);
        if (!isBeastIdExists) {
            revert EEEngine_TokenIdInvalid();
        }

        bool isEnvolveToIdExists = i_gameAssets.getIsTokenExists(_envolveToId);
        if (!isEnvolveToIdExists) {
            revert EEEngine_TokenIdInvalid();
        }

        bool isConditionAssetId = i_gameAssets.getIsTokenExists(
            conditionAssetId
        );
        if (!isConditionAssetId) {
            revert EEEngine_TokenIdInvalid();
        }

        s_beastIdToEvolveInfor[_beastTokenId] = EvolveInfor({
            evolutionable: true,
            evolveToBeastId: _envolveToId,
            conditionAssetId: conditionAssetId
        });

        emit BeastEvolveInforSetted(
            _beastTokenId,
            _envolveToId,
            conditionAssetId
        );
    }

    function setEggIncubateInfor(
        uint256 _eggId,
        uint256 _incubateToBeastId,
        uint256 _hatchingTime // in seconds
    ) public onlyOwner {
        bool isEggIdExists = i_gameAssets.getIsTokenExists(_eggId);
        if (!isEggIdExists) {
            revert EEEngine_TokenIdInvalid();
        }

        bool isBeastIdExists = i_gameAssets.getIsTokenExists(
            _incubateToBeastId
        );
        if (!isBeastIdExists) {
            revert EEEngine_TokenIdInvalid();
        }

        s_eggToIncubateInfor[_eggId] = IncubateInfor({
            hatchingTime: _hatchingTime,
            incubateToBeastId: _incubateToBeastId
        });
        s_isEgg[_eggId] = true;

        emit EggIncubateInforSetted(_eggId, _hatchingTime, _incubateToBeastId);
    }

    /////////////////////////////////////////
    // ========== Public Functions ==========
    /////////////////////////////////////////

    /// @notice Mint an account nft and create address for it
    /// @dev functions i_account.mintNft() and i_erc6551Registry.createAccount() can only be called in this contract. This ensures each AccountNFT can only generate a single address, ensuring game consistency.
    function createAccount(
        AccountNFT.AccountInfor calldata _accountInfor
    ) public returns (address) {
        uint256 accountId = i_account.mintNFT(msg.sender, _accountInfor);

        address accountAddr = i_erc6551Registry.createAccount(
            block.chainid,
            address(i_account),
            accountId,
            block.number,
            ""
        );

        i_account.updateAddrForAccount(accountId, accountAddr);

        s_tokenIdToAddress[accountId] = accountAddr;

        return payable(accountAddr);
    }

    /// @notice This variable allows users (or players) to mint their game assets in the game, by buying them with Ether Echelon Tokens or minting them for free because there will be assets priced at 0.
    function mintGameAssets(
        address account,
        uint256 _tokenId,
        uint256 _amount
    ) public {
        bool isTokenExists = i_gameAssets.getIsTokenExists(_tokenId);
        if (!isTokenExists) {
            revert EEEngine_TokenIdInvalid();
        }
        if (s_tokenHasSetPrice[_tokenId] = false) {
            revert EEEngine_TokenPriceHasNotSet();
        }

        uint256 price = getGameAssetPrice(_tokenId);
        uint256 totalPrice = price * _amount;

        i_etherEchelonToken.safeTransferFrom(
            msg.sender,
            address(this),
            totalPrice
        );

        _mintGameAssets(account, _tokenId, _amount, "");
    }

    function evolveBeast(address account, uint256 _beastIdForEvolve) public {
        bool isBeastIsExists = i_gameAssets.getIsTokenExists(_beastIdForEvolve);
        if (!isBeastIsExists) {
            revert EEEngine_TokenIdInvalid();
        }

        uint256 userBeastBalance = i_gameAssets.balanceOf(
            account,
            _beastIdForEvolve
        );
        if (userBeastBalance <= 0) {
            revert EEEngine_InsufficientBalance();
        }

        EvolveInfor memory evolveInfor = getBeastEnvolveInfor(
            _beastIdForEvolve
        );

        if (evolveInfor.evolutionable == false) {
            revert EEEngine_BeastCannotEvolve();
        }

        uint256 conditionAssetBalance = i_gameAssets.balanceOf(
            account,
            evolveInfor.conditionAssetId
        );

        if (conditionAssetBalance <= 0) {
            revert EEEngine_InsufficientBalance();
        }

        _burnGameAssets(account, _beastIdForEvolve, 1);
        _burnGameAssets(account, evolveInfor.conditionAssetId, 1);
        _mintGameAssets(account, evolveInfor.evolveToBeastId, 1, "");

        emit BeastEvolved(_beastIdForEvolve, evolveInfor.evolveToBeastId);
    }

    function incubateAnEgg(address account, uint256 _eggId) public {
        bool isEggIdExists = i_gameAssets.getIsTokenExists(_eggId);
        uint256 balanceEgg = i_gameAssets.balanceOf(account, _eggId);
        if (!isEggIdExists) {
            revert EEEngine_TokenIdInvalid();
        }
        if (s_isEgg[_eggId] == false) {
            revert EEEngine_NotAnEgg();
        }
        if (balanceEgg <= 0) {
            revert EEEngine_InsufficientBalance();
        }
        if (s_isEggIncubated[account][_eggId] == true) {
            revert EEEngine_EggAlreadyIncubated();
        }

        i_gameAssets.safeTransferFrom(account, address(this), _eggId, 1, "");

        s_isEggIncubated[account][_eggId] = true;
        s_incubatedInfor[account][_eggId] = block.timestamp;

        emit EggIncubated(account, _eggId, block.timestamp);
    }

    function hatchEgg(address account, uint256 _eggId) public {
        if (s_isEggIncubated[account][_eggId] == false) {
            revert EEEngine_EggNotIncubate();
        }

        if (s_isEgg[_eggId] == false) {
            revert EEEngine_NotAnEgg();
        }

        (bool canHatch, uint256 beastId) = _checkEggCanHatch(account, _eggId);

        if (!canHatch) revert EEEngine_EggCannotHatch();

        _burnGameAssets(address(this), _eggId, 1);
        _mintGameAssets(account, beastId, 1, "");

        emit EggHatched(account, _eggId, beastId);
    }

    ////////////////////////////////////////////
    // ========== Internal Functions ===========
    ////////////////////////////////////////////
    function _burnGameAssets(
        address account,
        uint256 _tokenId,
        uint256 amount
    ) internal {
        i_gameAssets.burn(account, _tokenId, amount);
    }

    function _burnBatchGameAssets(
        address account,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) internal {
        i_gameAssets.burnBatch(account, tokenIds, amounts);
    }

    function _mintGameAssets(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) internal {
        i_gameAssets.mint(to, tokenId, amount, data);
    }

    function _checkEggCanHatch(
        address account,
        uint256 _eggId
    ) internal view returns (bool canHatch, uint256 beastId) {
        IncubateInfor memory incubateInfor = s_eggToIncubateInfor[_eggId];

        uint256 startTime = getEggIncubatedStartTime(account, _eggId);

        uint256 timePast = block.timestamp - startTime;

        if (timePast >= incubateInfor.hatchingTime) {
            canHatch = true;
            beastId = incubateInfor.incubateToBeastId;
        } else {
            canHatch = false;
        }

        return (canHatch, beastId);
    }

    /////////////////////////////////////////
    // ========== ERC1155 Receiver ==========
    /////////////////////////////////////////
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public pure override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }

    ///////////////////////////////////////////////////////
    // ========== Public View / Getter Functions ==========
    ///////////////////////////////////////////////////////
    function getGameAssetPrice(uint256 _tokenId) public view returns (uint256) {
        return s_tokenToPrice[_tokenId];
    }

    function getMultipleGameAssetsPrices(
        uint256[] calldata _tokenIds
    ) public view returns (uint256[] memory tokenIds, uint256[] memory prices) {
        uint256 length = _tokenIds.length;
        tokenIds = new uint256[](length);
        prices = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = _tokenIds[i];
            tokenIds[i] = tokenId;
            prices[i] = s_tokenToPrice[tokenId];
        }
        return (tokenIds, prices);
    }

    function getBeastEnvolveInfor(
        uint256 _tokenId
    ) public view returns (EvolveInfor memory) {
        return s_beastIdToEvolveInfor[_tokenId];
    }

    function getEggIncubateInfor(
        uint256 _tokenId
    ) public view returns (IncubateInfor memory) {
        return s_eggToIncubateInfor[_tokenId];
    }

    function getEggIncubatedStartTime(
        address account,
        uint256 _tokenId
    ) public view returns (uint256) {
        return s_incubatedInfor[account][_tokenId];
    }
}
