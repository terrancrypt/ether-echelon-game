import { Spin, Tabs, TabsProps } from "antd";
import Chests from "./components/Chests";
import Eggs from "./components/Eggs";
import EvolutionaryStone from "./components/EvolutionaryStone";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAccount } from "wagmi";
import { NavLink } from "react-router-dom";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Chests",
    children: <Chests />,
  },
  {
    key: "2",
    label: "Eggs",
    children: <Eggs />,
  },
  {
    key: "3",
    label: "Evolutionary-Stone",
    children: <EvolutionaryStone />,
  },
];
const MarketPage = () => {
  const { isConnected } = useAccount();
  const accountList = useSelector((state: RootState) => state.accountSlice);
  const isAccountListLoading = useSelector(
    (state: RootState) => state.loadingSlice
  );

  return (
    <>
      {isConnected ? (
        <div className="container tracking-tighter">
          <div className="my-8 space-y-4">
            <h2 className="text-[16px]">Market</h2>
            {isAccountListLoading.loading ? (
              <Spin />
            ) : (
              <>
                {accountList.length < 1 ? (
                  <p className="text-[11px]">
                    You need an account to buy items in the market. Create one
                    to join the game at the{" "}
                    <NavLink className="underline" to="/create-account">
                      create account page
                    </NavLink>
                    .
                  </p>
                ) : (
                  <Tabs defaultActiveKey="1" items={items} />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center pt-10">Please connect your wallet</p>
      )}
    </>
  );
};

export default MarketPage;
