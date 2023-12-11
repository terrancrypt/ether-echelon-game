import { NavLink } from "react-router-dom";

const HowToPlayPage = () => {
  return (
    <div className="container tracking-tighter">
      <div className="my-8 space-y-4">
        <h2 className="text-[16px]">How To Play The Demo Game?</h2>
        <div className="space-y-3 text-[10px]">
          <h3 className="text-[12px] mt-6">1. How to login?</h3>
          <p>
            First, you need to own the{" "}
            <a
              className="underline"
              href="https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
              target="_blank"
            >
              Metamask Extension
            </a>{" "}
            wallet in the Google Chrome store.
          </p>
          <p>Then, create yourself a new personal wallet.</p>
          <p>
            Since this project operates on the Polygon Mumbai blockchain
            network, you need to add the network to your wallet and switch to
            Polygon Mumbai network.
          </p>
          <p>
            Add Polygon Mumbai network at{" "}
            <a
              className="underline"
              href="https://chainlist.org/chain/80001"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chainlist
            </a>
            .
          </p>
          <p>
            After successfully adding networks and switching networks, press the
            Connect Wallet button at the top of this website.
          </p>
          <p>
            To use the Polygon Mumbai network, you need to have MATIC to pay
            transaction fees on the network. Get it at{" "}
            <a
              className="underline"
              href="https://mumbaifaucet.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MumbaiFaucet
            </a>
            .
          </p>
          <p>
            Once you have successfully connected your wallet, go to the{" "}
            <NavLink className="underline" to="/create-account">
              account create page
            </NavLink>{" "}
            to create a new account.
          </p>
          <p>
            Each account will be represented by an NFT that you can add to your
            wallet. Each NFT will have a different tokenId (you can also call it
            AccountID). Use this Id to log into the game.
          </p>
        </div>
        <div className="space-y-3 text-[10px]">
          <h3 className="text-[12px] mt-6">
            2. How to buy items in the market?
          </h3>
          <p>
            All items in the market have prices set in EEG tokens. You need to
            receive it at the{" "}
            <NavLink to="/faucet" className="underline">
              faucet page
            </NavLink>{" "}
            to buy items in the game.
          </p>
          <img
            className="border"
            src="/images/screenshots/Screenshot1.png"
          ></img>
          <p>
            You can press the add to wallet button to add tokens to your wallet
            for convenient balance tracking.
          </p>
          <p>
            Every item in the game is an NFT, so you need to buy it by signing a
            transaction to buy it in the market.
          </p>
        </div>
        <div className="space-y-3 text-[10px]">
          <h3 className="text-[12px] mt-6">3. How to evolve a beast?</h3>
          <p>
            Not all monsters can evolve, you can check if it can evolve or not
            by checking its information on the{" "}
            <NavLink className="underline" to="/beasts">
              Ether Beasts page
            </NavLink>
            .
          </p>
          <p>
            If the beast can evolve, you need to have additional evolution
            stones (bought at the store) of the same type as that beast (for
            example, a fire-type beast needs fire stones to evolve it). Once you
            have these two items, you can evolve that beast into its next and
            more powerful form (represented by another nft).
          </p>
          <img
            className="border"
            src="/images/screenshots/Screenshot2.png"
            alt=""
          />
          <p>
            As shown above, if you want to evolve Cyclope into Demon Cyclope you
            need to have Fire Evolutionary Stone purchased at the market.
          </p>
          <img
            className="border"
            src="/images/screenshots/Screenshot3.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default HowToPlayPage;
