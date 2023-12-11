import { Tabs, TabsProps } from "antd";
import FireBeasts from "./components/FireBeasts";
import WaterBeasts from "./components/WaterBeasts";
import GrassBeasts from "./components/GrassBeasts";
import EarthBeasts from "./components/EarthBeasts";
import ElectricBeasts from "./components/ElectricBeasts";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Fire",
    children: <FireBeasts />,
  },
  {
    key: "2",
    label: "Water",
    children: <WaterBeasts />,
  },
  {
    key: "3",
    label: "Grass",
    children: <GrassBeasts />,
  },
  {
    key: "4",
    label: "Earth",
    children: <EarthBeasts />,
  },
  {
    key: "5",
    label: "Electric",
    children: <ElectricBeasts />,
  },
];

const Beasts = () => {
  return (
    <div className="container tracking-tighter">
      <div className="my-8 space-y-4">
        <h2 className="text-[16px]">Ether Beasts</h2>
        <span className="text-[10px] mt-6">
          Beasts cannot be purchased, can only be opened from chests, hatched
          eggs or in-game activities.
        </span>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default Beasts;
