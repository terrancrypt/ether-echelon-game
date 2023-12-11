import { message } from "antd";
import {
  addIpfsImageHashForAccountNft,
  addMultipleTokenIdsGameAssets,
  setBeastEvolveInfor,
  setChestInfor,
  setEggIncubateInfor,
  setGameAssetPrice,
  setNumberItemsInChest,
  setStartingBeast,
  setUpIfpsHashForGameAssets,
} from "../../services/contract-services/EngineServ";

const SettingPage = () => {
  // Add ipfs hash for account nft
  const ipfsHashForAccountNft = [
    "QmPGANm8VJfjtPAnzVVCkmEAzPVwEQwqe9Ku1txWsUHWpj",
    "QmVRDjKq3t2XgHjnhEqQu4oCB49pQa1pjMYJZwXntNqRqa",
    "QmeGVzhh6kbhFJaX3ZrrzDW5SxVjxqTWUtYka4jZu1WXAr",
    "QmbCNhn79YDKs4eTnM6R4858XPN5KkuVpQULMRC7uBJmRC",
    "QmPYNbnkoy739BLf9tBUxmau72wyHXzuTLGgNX8WZXNUcb",
    "QmbzeSZrJpbnzSrpDjaCfyZ38iNsPCfyAXNcoQQF7dVxdH",
    "QmR2r9bSpxxQxNAqkFb5yDAKxcA5h3dp4Ed8wsSoGovcU4",
    "QmYY7n1JdWFmNScEHWpabQAKwdiZ2NaV2xbz4W144ZrjkH",
    "QmWZHSkai5Ya7BLU3HM4JT5QP2kR6J2YhAe5vKoxZzpki7",
  ];

  const setUpIpfsHashAccount = async () => {
    for (let i = 0; i < ipfsHashForAccountNft.length; i++) {
      const ipfsHash = ipfsHashForAccountNft[i];
      await addIpfsImageHashForAccountNft(ipfsHash);
    }
    message.success("Finish step 1");
  };

  // Add Ipfs Hash Folder Metadata for Game Assets
  const ipfsHashFolder = "QmexjwpnxEkcVrUSgNLyRJme2vDprxrF9q5ynBnv6tr2r4";

  const setUpStep2 = async () => {
    await setUpIfpsHashForGameAssets(ipfsHashFolder);
    message.success("Finish step 2");
  };

  // Add tokenid for game assets to mint
  const arrTokenIds = [
    101000, 101001, 101002, 101003, 101004, 101005, 101006, 101007, 101008,
    101009, 101010, 101011, 101012, 101013, 101014, 101015, 101016, 101017,
    101018, 101019, 101020, 102000, 102001, 102002, 103000, 103001, 103002,
    103003, 104000, 104001, 104002,
  ];

  const setUpStep3 = async () => {
    await addMultipleTokenIdsGameAssets(arrTokenIds);
    message.success("Finish step 3");
  };

  const arrTokenIsForSetPrice = [
    102000, // Normal chest
    102001, // Rare chest
    102002, // Epic chest
    103000, // Fire stone
    103001, // Grass stone
    103002, // Water stone
    103003, // Earth stone
    104000, // Grass Snake Egg
    104001, // Thunder Owl Egg
    104002, // Demon Owl Egg
  ];

  const arrPricesForSetPrice = [
    "20000000000000000000",
    "50000000000000000000",
    "80000000000000000000",
    "30000000000000000000",
    "30000000000000000000",
    "30000000000000000000",
    "30000000000000000000",
    "40000000000000000000",
    "60000000000000000000",
    "60000000000000000000",
  ];

  // Add prices for tokens
  const setUpStep4 = async () => {
    for (let i = 0; i < arrTokenIsForSetPrice.length; i++) {
      await setGameAssetPrice(
        String(arrTokenIsForSetPrice[i]),
        arrPricesForSetPrice[i]
      );
    }
    message.success("Finish step 4");
  };

  // Add chest infor
  // Normal chest 102000
  let arrNormalChest = [
    101000, 101001, 101002, 101006, 101011, 101012, 101013, 101014, 102000,
    101017,
  ];
  // Rare chest 102001
  let arrRareChest = [
    101003, 101005, 101006, 101007, 101009, 101012, 101017, 102000, 103000,
    103003,
  ];
  // Epic chest 102002
  let arrEpicChest = [
    101004, 101017, 104000, 104001, 101016, 101008, 101002, 101009, 102000,
    102001,
  ];
  const setUpStep5 = async () => {
    await setNumberItemsInChest();
    await setChestInfor(102000, arrNormalChest);
    await setChestInfor(102001, arrRareChest);
    await setChestInfor(102002, arrEpicChest);
    message.success("Finish step 5");
  };

  // Add evolution infor
  const setUpStep6 = async () => {
    /// 101003 Cyclope + 103000 Fire stone => 101004 Demon cyclope
    await setBeastEvolveInfor(101003, 101004, 103000);

    /// 101007 Flam + 103000 Fire stone => 101008 Giant Flam
    await setBeastEvolveInfor(101007, 101008, 103000);

    /// 101009 Racoon + 103003 Earth stone => 101010 Giant Racoon
    await setBeastEvolveInfor(101009, 101010, 103003);

    /// 101017 Slime + 103002 Water stone => 101018 Super Slime
    await setBeastEvolveInfor(101017, 101018, 103002);

    /// 101019 Tiny Grass Snake + 103001 Grass stone => 101020 Grass snake
    await setBeastEvolveInfor(101019, 101020, 103001);

    message.success("Finish step 6");
  };

  // Add egg infor
  const setUpStep7 = async () => {
    /// 104000 Grass Snake Egg + Hatching time 60 second => 101019 Tiny Grass Snake
    await setEggIncubateInfor(104000, 101019, 60);

    /// 104001 Thunder Owl Egg + Hatching time 900 second (15 minutes) => 101015 Thunder Owl
    await setEggIncubateInfor(104001, 101015, 900);

    /// 104002 Demon Owl Egg + Hatching time 900 second (15 minutes) => 101016 Demon Owl
    await setEggIncubateInfor(104002, 101016, 900);

    message.success("Finish step 7");
  };

  const setUpStep8 = async () => {
    await setStartingBeast(101000);
    await setStartingBeast(101001);
    await setStartingBeast(101002);

    message.success("Finish step 8");
  };

  return (
    <div className="p-10 mt-10 text-[12px] flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span>Step 1</span>{" "}
        <button
          onClick={setUpIpfsHashAccount}
          className="bg-white text-black p-2"
        >
          Add Ipfs Hash For Account
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 2</span>{" "}
        <button onClick={setUpStep2} className="bg-white text-black p-2">
          setUpIfpsHashForGameAssets
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 3</span>{" "}
        <button onClick={setUpStep3} className="bg-white text-black p-2">
          addMultipleTokenIdsGameAssets
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 4</span>
        <button onClick={setUpStep4} className="bg-white text-black p-2">
          setGameAssetPrice
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 5</span>
        <button onClick={setUpStep5} className="bg-white text-black p-2">
          setUpChestInfor
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 6</span>
        <button onClick={setUpStep6} className="bg-white text-black p-2">
          setBeastEvolveInfor
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 7</span>
        <button onClick={setUpStep7} className="bg-white text-black p-2">
          setEggIncubateInfor
        </button>
      </div>
      <div className="flex items-center gap-4 ">
        <span>Step 8</span>
        <button onClick={setUpStep8} className="bg-white text-black p-2">
          setStartingBeast
        </button>
      </div>
    </div>
  );
};

export default SettingPage;
