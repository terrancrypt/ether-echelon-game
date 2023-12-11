# Ether Echelon Documentation

Welcome to Ether Echelon Game

>  Notice: I apologize for any Vietnamese words in my code if you read the code.

## About
EtherEchelon is a project focused on Web3 Gaming, combining the power of NFTs (Non-Fungible Tokens), ERC-6551 standards, and Chainlink VRF to create a distinctive and stylish gaming experience.

## Techstacks
- Smart contract: Solidity, Foundry, Chainlink, OpenZeppelin, ERC6551, NFTs,...
- Front-end: Game build with HTML Canvas, React, TypeScript, Firebase, Redux, Antd, TailwindCSS,..

## Smart Contract
The network used is Polygon Mumbai.

The contract address has been deployed: 
- EEEngine: [0x63Dcb9d8a5220582555fFb7757e08882eFc27e1B](https://mumbai.polygonscan.com/address/0x63dcb9d8a5220582555ffb7757e08882efc27e1b)
- AccountNFT: [0x295DA2862970756eaA977639C130ACE30ba23BC2](https://mumbai.polygonscan.com/address/0x295DA2862970756eaA977639C130ACE30ba23BC2)
- ERC6551Registry: [0x259739DC2f1cAf31e23c11E8f3137563BeA38686](https://mumbai.polygonscan.com/address/0x259739DC2f1cAf31e23c11E8f3137563BeA38686)
- GameAssetsNFT: [0x4AeB35952971271F4358E791451F2095E197a010](https://mumbai.polygonscan.com/address/0x4AeB35952971271F4358E791451F2095E197a010)
- EEG Token: [0xcdcfb95C577D8c1a94cEa08030c8F91E35407F5E](https://mumbai.polygonscan.com/address/0xcdcfb95C577D8c1a94cEa08030c8F91E35407F5E)

The most important contract is the engine contract, you can view the contract's document in the EEEngine.sol file.

### Account NFT (ERC721)
Any user will be able to create their own NFT Account and follow the ERC721 standard. Based on ERC6551, each NFT will have its own address, which can be obtained using the tokenURI() function when called into this contract.

Each NFT Account can only create one unique address for itself. This address helps store in-game assets (standardized by ERC1155), separate from the owner's original address. If the owner has this NFT Account, they will also be the owner of all NFTs in the NFT Account address.

This will make transferring all in-game items to another wallet address simple and in just one transaction. For example, if Simon decides to stop playing and he doesn't want all the hard work he's put into his passion game to go to waste if he doesn't play anymore. Then he can go to the in-game market and sell this Account NFT along with all the accompanying items included in this Account NFT.

The Account NFT URI token is stored on-chain, because not too much changes around this NFT during gameplay. However, this may change if in the future I continue to develop this project if it is successful.

### Game Assets NFT (ERC1155)
All assets in the game (including Ethers Beasts and Other Items) will be minted from a single contract `GameAssetsNFT.sol`.

TokenURI() of this contract will be stored as a folder at IPFS. Where it will be easy to update and change game parameters for game balance and gameplay improvement.

## Inspiration
EtherEchelon derives its inspiration from the limitless possibilities that arise at the intersection of blockchain technology and gaming innovation. The project envisions a dynamic and inclusive Web3 Gaming ecosystem, where players not only immerse themselves in captivating virtual worlds but also become true owners of their in-game assets through the revolutionary concept of NFTs.

The driving force behind EtherEchelon lies in redefining the gaming experience by leveraging the transparent and decentralized nature of blockchain. Chainlink VRF plays a pivotal role in this vision, introducing an unpredictable and fair aspect to the acquisition of in-game assets. The thrill and excitement of opening a chest become integral to the gaming journey, showcasing the transformative potential of blockchain technology in enhancing user engagement.

In essence, EtherEchelon is not just a project; it's a personal inspiration to break barriers, challenge norms, and pave the way for a new era of gaming where every player is a true stakeholder in the virtual realms they explore.

## What it does
EtherEchelon is a cutting-edge Web3 Gaming project that leverages blockchain technology, particularly Chainlink VRF (Verifiable Random Function), to enhance the gaming experience. The project focuses on introducing randomness and unpredictability into the game by utilizing Chainlink VRF, specifically for activities like opening chests within the game.

Through the integration of NFTs and adherence to the ERC-6551 standard, EtherEchelon allows players to truly own and manage their in-game assets, fostering a sense of uniqueness and value. The commitment to a free-to-play model ensures accessibility for all players.

In essence, EtherEchelon aims to revolutionize gaming by combining blockchain innovation, NFTs, and Chainlink VRF to create an immersive and unpredictable gaming environment where every player can participate, engage, and truly own a piece of the virtual world.

EtherEchelon transcends the conventional boundaries of a singular game; it aspires to evolve into an expansive gaming universe. Within this visionary ecosystem, players possess the ability to utilize their NFTs across various games, thereby transforming a single NFT into a gateway to diverse gaming experiences. Adhering to the ERC-6551 standard, EtherEchelon introduces a paradigm shift where individual NFT items need not be confined to a personal wallet. Instead, they can be securely stored within an account represented by an NFT.

## How I built it
### Smart Contracts and ERC-6551 Standard Implementation:
Developed smart contracts on a blockchain platform (such as Ethereum) to manage the creation, distribution, and ownership of NFTs.
Implemented the ERC-6551 standard to ensure compatibility with EtherEchelon's vision of NFT Accounts and their associated in-game assets.

### Chainlink VRF Integration:
Integrated Chainlink VRF to introduce randomness and unpredictability, particularly for activities like opening chests within the game.
Implemented Chainlink's decentralized oracle network to securely and verifiably access real-world data within the gaming environment.

### User Wallet Integration:
Facilitated the seamless integration of user wallets, allowing players to securely store and manage their NFTs and in-game assets.
Ensured compatibility with popular wallet providers to enhance user accessibility.

### Game Development:
Developed the game's core mechanics, storyline, and interactive elements to create an engaging gaming experience.
Incorporated NFTs into the game as unique and tradable in-game assets, ensuring they have meaningful utility within the gaming universe.

### Free-to-Play Model Implementation:
Designed and implemented the free-to-play model, ensuring that players can participate without financial barriers while maintaining a sustainable economic model for the project.

## Challenges I ran into
### Learning Curve in Game Development:
Transitioning from smart contract development to game development involved a significant learning curve, especially when adapting to the intricacies of JavaScript and game development frameworks.

### Integration of Blockchain and Gaming Logic:
Harmonizing the logic of blockchain technology with the game's mechanics was challenging. Ensuring that smart contracts seamlessly interact with in-game elements required a deep understanding of both domains.

### User Experience (UX) Design:
Designing an intuitive and engaging user experience in a game involved a different skill set than designing smart contracts. Balancing the technical aspects with user-friendly interfaces was challenging but crucial for user adoption.

### Optimizing Performance:
Games demand a high level of performance, and optimizing code and assets to deliver a smooth gaming experience was vital. This optimization process was time-consuming, especially coming from a background primarily focused on smart contracts.

### Testing and Quality Assurance:
Ensuring the reliability and security of both smart contracts and game code required thorough testing. Combining these two aspects presented additional challenges in terms of comprehensive quality assurance.

### Cross-Platform Compatibility:
Achieving compatibility across various devices and platforms added complexity. Ensuring a consistent experience for players using different browsers or devices was a common challenge in web-based game development.

## Accomplishments I'm proud of
### Successful Integration of Chainlink VRF:
Achieved a seamless integration of Chainlink VRF into the gaming mechanics, introducing randomness and unpredictability to enhance the gaming experience.

### Creation of a Unique NFT Ecosystem:
Established a unique NFT ecosystem based on the ERC-6551 standard, introducing the concept of NFT Accounts and cross-game utility for in-game assets.

### Development of Secure and Robust Smart Contracts:
Built secure and robust smart contracts to ensure the integrity and safety of in-game assets and transactions within the EtherEchelon ecosystem.

### Transition from Smart Contract to Game Development:
Successfully navigated the transition from a smart contract engineer to a game developer, adapting to new technologies and skill sets.

### Establishment of a Free-to-Play Model:
Implemented a free-to-play model while maintaining a sustainable economic structure, ensuring accessibility for all players.

## What I learned

### Multidisciplinary Skills Acquisition:
Gained proficiency in both smart contract development and game development, bridging the gap between blockchain technology and gaming mechanics.

### Blockchain-Gaming Integration Challenges:
Overcame hurdles in harmonizing blockchain logic with gaming mechanics, acquiring a deep understanding of how smart contracts seamlessly interact with in-game elements.

### User-Centric Design Principles:
Developed skills in user experience (UX) design, understanding the importance of intuitive interfaces to enhance player engagement and adoption.

### Performance Optimization in Game Development:
Mastered the art of optimizing code and assets for superior gaming performance, realizing the critical balance between technical complexities and delivering a smooth user experience.

### Comprehensive Testing and Quality Assurance:
Executed thorough testing procedures for both smart contracts and game code, acknowledging the significance of robust quality assurance in ensuring reliability and security.

## What's next for Ether Echelon Game
### Cross-Game NFT Utility:
Implement a cross-game NFT utility system that allows players to use their NFTs across multiple games within the EtherEchelon gaming universe.
Develop protocols to ensure the secure and seamless transfer of NFT ownership between different games.

### Community Engagement and Feedback:
Foster an active and engaged community through social media, forums, and other channels.
Gather feedback from the community to iteratively improve the gaming experience and address any issues.

### Security Audits:
Conduct rigorous security audits to identify and mitigate potential vulnerabilities in smart contracts and the overall gaming ecosystem.
Collaborate with reputable security firms to ensure the safety of user assets.

### Chainlink CCIP Integration for Chain Agnosticism:
Pave the way for players to enjoy the EtherEchelon experience on any blockchain network of their choice. By implementing Chainlink Cross-Chain Interoperability Protocol (CCIP), the game will transcend the limitations of a single blockchain, providing players with the flexibility to participate and use their assets on different chains seamlessly.

### Enhanced Player-to-Player Interactions:
Introduce a sophisticated player-to-player interaction mechanism within EtherEchelon. This feature will facilitate meaningful social connections, collaborations, and competitions among players, enriching the overall gaming experience. Whether through in-game alliances, trading mechanisms, or collaborative quests, the goal is to foster a vibrant and engaging player community.

### Improved Player-to-System Interaction:
Develop advanced communication channels between players and the EtherEchelon system. This includes features like personalized in-game messaging, feedback mechanisms, and interactive interfaces, ensuring that players have a direct and impactful role in shaping the evolution of the gaming universe.

### Integration of Dynamic Quests and Challenges:
Implement a dynamic quest and challenge system to keep the gaming experience fresh and exciting. This feature will introduce regularly updated quests, events, and challenges that adapt to the players' progression, providing a continuous sense of achievement and exploration within the EtherEchelon universe.

### NFT-Backed Governance Mechanism:
Explore the implementation of a decentralized governance mechanism backed by NFTs. This will empower the community to actively participate in decision-making processes related to the development and evolution of EtherEchelon. NFT holders could potentially vote on key decisions, ensuring a democratic and community-driven approach to governance.

### Sustainable Economic Model Refinement:
Continuously refine the sustainable economic model of EtherEchelon, balancing the free-to-play accessibility with the long-term viability of the project. This involves optimizing in-game economies, introducing innovative monetization strategies, and ensuring a fair and rewarding system for all participants.

### Educational Initiatives for Blockchain Gaming:
Launch educational initiatives within EtherEchelon to promote awareness and understanding of blockchain technology and NFTs. This effort aims to empower players with the knowledge needed to make informed decisions about their in-game assets and actively participate in the broader blockchain gaming ecosystem.
