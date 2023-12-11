import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { beastsData } from "../../data/beasts";
import { skillsData } from "../../data/skills";

const BeastDetail = () => {
  const { key } = useParams();
  const [data, setData] = useState<any>();

  const fetchData = async () => {
    if (key) {
      const beast = {
        name: beastsData[key].name,
        assets: {
          avatar: beastsData[key].assets.avatar,
          inGameImg: beastsData[key].assets.inGameImg,
        },
        evolutionable: beastsData[key].evolutionable,
        evolutionStatus: {
          toName: beastsData[key].evolutionStatus?.toName,
          toFaceset: beastsData[key].evolutionStatus?.toFaceset,
          toTokenId: beastsData[key].evolutionStatus?.toTokenId,
        },
        rarity: beastsData[key].rarity,
        type: beastsData[key].type,
        index: {
          hp: beastsData[key].index.hp,
          attack: beastsData[key].index.attack,
          defend: beastsData[key].index.defend,
          speed: beastsData[key].index.speed,
        },
        skills: beastsData[key].skills,
      };
      setData(beast);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
    fetchDataAsync();
  }, [key]);

  return (
    <div className="container tracking-tighter">
      <>
        {data && (
          <div className="my-8 space-y-4 px-32">
            <div className="flex justify-normal items-start gap-6">
              <img
                src={data.assets.avatar}
                alt={data.name}
                className="w-20 h-20"
              />
              <div className="space-y-2">
                <h2 className="text-[20px]">{data.name}</h2>
                <div>
                  {data.rarity === "Normal" && (
                    <span className="bg-white p-2 text-black text-[10px] capitalize">
                      {data.rarity}
                    </span>
                  )}
                  {data.rarity === "Rare" && (
                    <span className="bg-orange-600 p-2 text-white text-[10px] capitalize">
                      {data.rarity}
                    </span>
                  )}
                  {data.rarity === "Epic" && (
                    <span className="bg-purple-600 p-2 text-white text-[10px] capitalize">
                      {data.rarity}
                    </span>
                  )}
                  {data.evolutionable && (
                    <span className="p-2 text-[10px] bg-emerald-600">
                      Evolutionable
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-20 py-8">
              <div className="flex flex-col gap-4">
                <h3 className="underline">Index</h3>
                <span>Type: {data.type}</span>
                <span>HP: {data.index.hp}</span>
                <span>Attack: {data.index.attack}</span>
                <span>Defend: {data.index.defend}</span>
                <span>Speed: {data.index.speed}</span>
              </div>
              <div>
                <h3 className="underline">Skills</h3>
                <div className="pt-4">
                  {data.skills?.map((skill: any) => (
                    <div className="flex items-center gap-2 border-white border p-2">
                      <img
                        className="w-10 h-10"
                        src={skillsData[skill].assets.preview}
                        alt={skill}
                      />
                      <p className="text-[14px]">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
              <>
                {data.evolutionable && (
                  <div>
                    <h3 className="underline">Evolutionary Form</h3>
                    <div className="pt-4 ">
                      <NavLink to={`/beasts/${data.evolutionStatus.toTokenId}`}>
                        <div className="border-white border p-2 flex items-center gap-3 hover:scale-95 cursor-pointer transition-all">
                          <img
                            className="w-10 h-10"
                            src={data.evolutionStatus.toFaceset}
                            alt=""
                          />
                          <span>{data.evolutionStatus.toName}</span>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default BeastDetail;
