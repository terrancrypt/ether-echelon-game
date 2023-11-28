# Ether Echelon Documentation

Welcome to Ether Echelon Game

>  Notice: I apologize for any Vietnamese words in my code if you read the code.

## About

## Techstacks

## Smart Contract

## Game Core
In the game there are 3 main actors, each actor is tokenized and details will be below.

### Account NFT (ERC721)
Any user will be able to create their own NFT Account and follow the ERC721 standard. Based on ERC6551, each NFT will have its own address, which can be obtained using the tokenURI() function when called into this contract.

Each NFT Account can only create one unique address for itself. This address helps store in-game assets (standardized by ERC1155), separate from the owner's original address. If the owner has this NFT Account, they will also be the owner of all NFTs in the NFT Account address.

This will make transferring all in-game items to another wallet address simple and in just one transaction. For example, if Simon decides to stop playing and he doesn't want all the hard work he's put into his passion game to go to waste if he doesn't play anymore. Then he can go to the in-game market and sell this Account NFT along with all the accompanying items included in this Account NFT.

The Account NFT URI token is stored on-chain, because not too much changes around this NFT during gameplay. However, this may change if in the future I continue to develop this project if it is successful.

### Game Assets NFT (ERC1155)
All assets in the game (including Ethers Beasts and Other Items) will be minted from a single contract `GameAssetsNFT.sol`.

TokenURI() of this contract will be stored as a folder at IPFS. Where it will be easy to update and change game parameters for game balance and gameplay improvement.

## The Future