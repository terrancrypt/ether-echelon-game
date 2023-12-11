import { useEffect, useState } from "react";
import { beastsData } from "../../../data/beasts";
import { Tooltip } from "antd";
import { NavLink } from "react-router-dom";

const FireBeasts = () => {
  const [dataBeasts, setDataBeasts] = useState<any>();

  const fetchData = () => {
    const keys: string[] = Object.keys(beastsData).filter(
      (skillName) => beastsData[skillName].type === "Fire"
    );

    const beasts = keys.map((key) => ({
      key: key,
      name: beastsData[key].name,
      assets: {
        avatar: beastsData[key].assets.avatar,
        inGameImg: beastsData[key].assets.inGameImg,
      },
      evolutionable: beastsData[key].evolutionable,
      rarity: beastsData[key].rarity,
      type: beastsData[key].type,
      index: {
        hp: beastsData[key].index.hp,
        attack: beastsData[key].index.attack,
        defend: beastsData[key].index.defend,
        speed: beastsData[key].index.speed,
      },
      skills: beastsData[key].skills,
    }));
    setDataBeasts(beasts);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {dataBeasts?.map((beast: any, index: any) => (
          <div key={index} className="border p-4 relative">
            <>
              {beast.rarity === "Normal" && (
                <div className="absolute right-0 top-0 text-[10px]">
                  {beast.evolutionable && (
                    <Tooltip
                      className="cursor-pointer"
                      title="Can evolve into another beast"
                    >
                      <span className="bg-emerald-600 p-1 text-[10px]">
                        Evo
                      </span>
                    </Tooltip>
                  )}
                  <span className=" bg-white p-1 text-black">Normal</span>
                </div>
              )}

              {beast.rarity === "Rare" && (
                <div className="absolute right-0 top-0 text-[10px]">
                  {beast.evolutionable && (
                    <Tooltip
                      className="cursor-pointer"
                      title="Can evolve into another beast"
                    >
                      <span className="bg-emerald-600 p-1 text-[10px]">
                        Evo
                      </span>
                    </Tooltip>
                  )}
                  <span className="bg-orange-600 p-1 text-white ">Rare</span>
                </div>
              )}

              {beast.rarity === "Epic" && (
                <span className="absolute right-0 top-0 bg-purple-600 p-1 text-white text-[10px]">
                  Epic
                </span>
              )}
            </>
            <h3 className="text-base pb-3">{beast.name}</h3>
            <div className="flex justify-between gap-6">
              <img
                className="w-[50px] h-[50px]"
                src={beast.assets.avatar}
                alt=""
              />
              <div className="flex flex-col w-full">
                <span>HP: {beast.index.hp}</span>
                <span>Attack: {beast.index.attack}</span>
                <span>Defend: {beast.index.defend}</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0">
              <NavLink to={`/beasts/${beast.key}`}>
                <button className="bg-white px-4 py-2 text-black border-black hover:bg-slate-400 hover:text-white transition-all">
                  Detail
                </button>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FireBeasts;
