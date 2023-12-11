import { useEffect, useState } from "react";
import { skillsData } from "../../../data/skills";
import { SkillsType } from "../Skills.type";

const GameInforElementals = () => {
  const [dataSkills, setDataSkills] = useState<SkillsType[] | null>(null);
  const fetchData = () => {
    const keys: string[] = Object.keys(skillsData).filter(
      (skillName) => skillsData[skillName].type === "Elementals"
    );

    const skills: SkillsType[] = keys.map((key) => ({
      name: key,
      type: skillsData[key].type,
      elemental: skillsData[key].elemental,
      target: skillsData[key].target,
      power: skillsData[key].power,
      assets: skillsData[key].assets,
      description: skillsData[key].description,
    }));

    setDataSkills(skills);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {dataSkills?.map((skill, index) => (
          <div key={index} className="space-y-3 border p-4">
            <h3 className="text-base">{skill.name}</h3>
            <div className="flex justify-between gap-2">
              <img
                className="w-[50px] h-[50px]"
                src={skill.assets.preview}
                alt=""
              />
              <span>{skill.description}</span>
            </div>
            <div>
              <p>Power: {skill.power}</p>
              <p>Elemental: {skill.elemental}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameInforElementals;
