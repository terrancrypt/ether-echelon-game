// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {EEG} from "src/token/EEG.sol";
import {AccountNFT} from "src/nft/AccountNFT.sol";
import {GameAssetsNFT} from "src/nft/GameAssetsNFT.sol";
import {IERC6551Registry} from "src/interfaces/IERC6551Registry.sol";

/// @title Ether Echelon Engine Contract
/// @author Terrancrypt
/// @notice This Contract Engine inherits from all other contracts in the Ether Echelon Game application to run everything centrally into a single contract for both owner and user. This only supports hackathons and there will definitely be changes in the future.
contract EEEngine is Ownable, IERC165, IERC1155Receiver, VRFConsumerBaseV2 {
    using SafeERC20 for EEG;

    error EEEngine_AddressAlreadyExists();
    error EEEngine_TokenIdInvalid();
    error EEEngine_MustNotBeZero();
    error EEEngine_InvalidArray();
    error EEEngine_InputNotMatchLength();
    error EEEngine_TokenPriceHasNotSet();
    error EEEngine_InsufficientBalance();
    error EEEngine_BeastCannotEvolve();
    error EEEngine_NotAnEgg();
    error EEEngine_EggAlreadyIncubated();
    error EEEngine_EggNotIncubate();
    error EEEngine_EggCannotHatch();
    error EEEngine_NumberItemsInChestNotSet();
    error EEEngine_VrfRequestInvalid();

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
    uint32 private s_numberItemsInChest;
    mapping(uint256 chestId => uint256[] gameAssetIds) private s_chestIdToInfor;

    // Chainlink VRF
    VRFCoordinatorV2Interface private s_vrfCoordinator;
    bytes32 private s_vrfKeyHash;
    uint64 private s_vrfSubscriptionId;
    struct VRFRequestInfor {
        bool exists;
        bool fulfilled;
        uint256[] randomWords;
        uint256 chestId;
        address account;
    }
    mapping(uint256 vrfRequestId => VRFRequestInfor) private s_vrfRequestInfor;
    uint32 constant NUMB_WORDS = 1;

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
        address etherEchelonToken,
        uint64 vrfSubscriptionId,
        address vrfCoordinator,
        bytes32 vrfKeyHash
    ) Ownable(initialOwner) VRFConsumerBaseV2(vrfCoordinator) {
        i_erc6551Registry = IERC6551Registry(erc6551Registry);
        i_account = AccountNFT(accountNftAddress);
        i_gameAssets = GameAssetsNFT(gameAssetsAddress);
        i_etherEchelonToken = EEG(etherEchelonToken);
        s_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        s_vrfSubscriptionId = vrfSubscriptionId;
        s_vrfKeyHash = vrfKeyHash;
    }

    ///////////////////////////////
    // ========== Events ==========
    ///////////////////////////////
    event VRFInformationChanged(
        uint256 newSubscriptionId,
        address newVrfCoordinator,
        bytes32 newKeyHash
    );
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
    event NumberItemInChestChanged(uint256 numberItemsInChest);
    event ChestInforSetted(uint256 indexed chestId, uint256[] gameAssets);
    event OpenChestConfirmed(
        address indexed account,
        uint256 indexed chestId,
        uint256 vrfRequestId
    );
    event ChestOpened(
        address indexed account,
        uint256 indexed chestId,
        uint256 gameAssetId
    );

    ///////////////////////////////////////////////////
    // ========== Owner's Function Inherited ==========
    ///////////////////////////////////////////////////

    /// @dev This function allows the owner to change the information of the Chainlink VRF
    function changeVrfInfor(
        uint64 newSubscriptionId,
        address newVrfCoordinator,
        bytes32 newKeyHash
    ) public onlyOwner {
        s_vrfSubscriptionId = newSubscriptionId;
        s_vrfCoordinator = VRFCoordinatorV2Interface(newVrfCoordinator);
        s_vrfKeyHash = newKeyHash;
        emit VRFInformationChanged(
            newSubscriptionId,
            newVrfCoordinator,
            newKeyHash
        );
    }

    /// @dev This function helps owners add new ipfsImageHash for users to increase characters in the game. Based on ipfsHash, users can see characters in their game and each character will represent an account in the game.
    function addIpfsImageHashForAccountNft(
        string memory _ipfsImageHash
    ) public onlyOwner {
        i_account.addIpfsImageHash(_ipfsImageHash);
    }

    /// @dev This function helps the owner set up an ipfsHash for all GameAssets in the game. This hash returns a folder containing metadata of all items (beasts, eggs, chests,...) in the game. Allowing changes to ipfsHash is to add new characters, edit parameters or balance the game.
    function setUpIfpsHashForGameAssets(
        string memory _ipfsHash
    ) public onlyOwner {
        i_gameAssets.setIpfsHash(_ipfsHash);
    }

    /// @dev This function allows adding a game asset id
    function addSingleTokenIdForGameAssets(uint256 _tokenId) public onlyOwner {
        i_gameAssets.addSingleTokenId(_tokenId);
    }

    /// @dev This function allows adding multiple game asset ids
    function addMultipleTokenIdsGameAssets(
        uint256[] calldata _tokenIds
    ) public onlyOwner {
        i_gameAssets.addMultipleTokenIds(_tokenIds);
    }

    /// @dev This function changes the state of gameassets, for example if an item is being updated, changing or removed.
    function updateTokenStateInGameAssets(
        uint256 _tokenId,
        bool _state
    ) public onlyOwner {
        i_gameAssets.updateTokenState(_tokenId, _state);
    }

    /// @dev This function helps set the value of a game asset id, every item in the game has a value (purchased with ether echelon token - EEG.sol contract). Even if the item has a price = 0, it must be set up first before it can be minted.
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

    /// @dev This function adds multiple prices to game assets at once.
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

    /// @dev This function sets which token (beast) Ids can be evolved under certain conditions (stone items). When one beast wants to evolve into its next form (game asset nft), it must have an evolution stone (game asset nft)
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

    /// @dev This function sets the incubation information (which is an nft game asset), including what beast it will become when it hatches, and how long it takes to hatch.
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

    /// @dev This function helps set a number to know how many NFTs a chest needs to be opened when opening that chest with the openChest() function.
    function setNumberItemsInChest(
        uint32 _newNumberItemsInChest
    ) public onlyOwner {
        if (_newNumberItemsInChest <= 0) {
            revert EEEngine_MustNotBeZero();
        }

        s_numberItemsInChest = _newNumberItemsInChest;

        emit NumberItemInChestChanged(_newNumberItemsInChest);
    }

    /// @dev This function helps determine which types of game assets a chest can open, for example: normal chest can open normal gameAssets, rare chest can open rare gameAssets.
    function setChestInfor(
        uint256 _chestId,
        uint256[] calldata gameAssetsInChest
    ) public onlyOwner {
        bool isChestIdExists = i_gameAssets.getIsTokenExists(_chestId);
        if (!isChestIdExists) {
            revert EEEngine_TokenIdInvalid();
        }
        if (s_numberItemsInChest <= 0) {
            revert EEEngine_NumberItemsInChestNotSet();
        }
        if (gameAssetsInChest.length < s_numberItemsInChest) {
            revert EEEngine_InvalidArray();
        }

        for (uint256 i; i < gameAssetsInChest.length; i++) {
            uint256 tokenId = gameAssetsInChest[i];
            bool isTokenIdExists = i_gameAssets.getIsTokenExists(tokenId);
            if (!isTokenIdExists) {
                revert EEEngine_TokenIdInvalid();
            }
        }

        s_chestIdToInfor[_chestId] = gameAssetsInChest;

        emit ChestInforSetted(_chestId, gameAssetsInChest);
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

    function openChest(
        address account,
        uint256 _chestId
    ) public returns (uint256 requestId) {
        bool isChestIdExists = i_gameAssets.getIsTokenExists(_chestId);
        if (!isChestIdExists) {
            revert EEEngine_TokenIdInvalid();
        }

        uint256 accountBalance = i_gameAssets.balanceOf(account, _chestId);
        if (accountBalance <= 0) {
            revert EEEngine_InsufficientBalance();
        }

        uint256[] memory chestInfor = getChestInfor(_chestId);
        if (s_numberItemsInChest != chestInfor.length) {
            revert EEEngine_NumberItemsInChestNotSet();
        }

        i_gameAssets.safeTransferFrom(account, address(this), _chestId, 1, "");

        requestId = s_vrfCoordinator.requestRandomWords(
            s_vrfKeyHash,
            s_vrfSubscriptionId,
            3,
            500000,
            NUMB_WORDS
        );

        s_vrfRequestInfor[requestId] = VRFRequestInfor({
            exists: true,
            fulfilled: false,
            randomWords: new uint256[](0),
            chestId: _chestId,
            account: account
        });

        emit OpenChestConfirmed(account, _chestId, requestId);
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

    ///////////////////////////////////////////////
    // ========== ChainLink VRF Functions =========
    ///////////////////////////////////////////////
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        VRFRequestInfor memory requestInfor = s_vrfRequestInfor[_requestId];
        if (requestInfor.exists == false) {
            revert EEEngine_VrfRequestInvalid();
        }

        uint256 chestId = requestInfor.chestId;
        address account = requestInfor.account;
        uint256 randomItemIndex = (_randomWords[0] % s_numberItemsInChest) + 1;

        uint256[] memory gameAssetsInChest = getChestInfor(chestId);
        uint256 randomGameAssetId = gameAssetsInChest[randomItemIndex];

        s_vrfRequestInfor[_requestId].fulfilled = true;

        _burnGameAssets(address(this), chestId, 1);
        _mintGameAssets(account, randomGameAssetId, 1, "");

        emit ChestOpened(account, chestId, randomGameAssetId);
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

    function getChestInfor(
        uint256 _tokenId
    ) public view returns (uint256[] memory) {
        return s_chestIdToInfor[_tokenId];
    }
}
