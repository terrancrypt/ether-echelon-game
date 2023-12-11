import { Tabs, TabsProps } from "antd";
import GameInforElementals from "./components/GameInforElementals";
import GameInforAttack from "./components/GameInforAttack";
import GameInforMagic from "./components/GameInforMagic";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Elementals",
    children: <GameInforElementals />,
  },
  {
    key: "2",
    label: "Attack",
    children: <GameInforAttack />,
  },
  {
    key: "3",
    label: "Magic",
    children: <GameInforMagic />,
  },
];

const SkillsPage = () => {
  return (
    <div className="container tracking-tighter">
      <div className="my-8 space-y-4">
        <h2 className="text-[16px]">Skills</h2>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default SkillsPage;
