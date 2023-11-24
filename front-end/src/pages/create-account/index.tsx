import { Form, Select, Input, message, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { charactersData } from "../../data/characters";
import Image from "next/image";
import { spaceMono } from "@/styles/font";
import {
  getAccount,
  waitForTransaction,
  watchContractEvent,
} from "wagmi/actions";
import {
  accountNftContract,
  mintAccountNft,
} from "@/services/contract-services/AccountNftServ";
import AccountNftAbi from "../../services/ABIs/AccountNftAbi.json";
import { addTokenToWallet } from "@/utils/metamask";
import { formatUnits } from "viem";
import shortenAddress from "@/utils/shortenAddress";

const { Option } = Select;

interface CharacterImg {
  inGameImg: string;
  avatarImg: string;
}

interface AccountInfor {
  username: string;
  character: string;
}

interface AccountCreated extends AccountInfor {
  tokenId: string;
}

const CreateAccountPage: React.FC = () => {
  const [form] = Form.useForm();
  const { address } = getAccount();
  const [characterImg, setCharacterImg] = useState<CharacterImg | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState<AccountCreated[] | null>(
    null
  );

  const onCharacterChange = (key: string) => {
    const characterData = charactersData[key];

    if (characterData) {
      const { inGameImg, avatarImg } = characterData;
      setCharacterImg({ inGameImg, avatarImg });
    }
  };

  const onFinish = async (values: AccountInfor) => {
    setIsLoading(true);
    try {
      const { ipfsHash } = charactersData[values.character];
      watchContractEvent(
        {
          address: accountNftContract,
          abi: AccountNftAbi,
          eventName: "AccountNftMinted",
        },
        (log: any) => {
          if (log[0].args.owner === address) {
            try {
              const storedData = window.localStorage.getItem("userData");
              const userDataArray = storedData ? JSON.parse(storedData) : [];
              const newData = {
                address: log[0].args.owner,
                username: values.username,
                character: values.character,
                tokenId: formatUnits(log[0].args.tokenId, 0),
              };
              userDataArray.push(newData);
              window.localStorage.setItem(
                "userData",
                JSON.stringify(userDataArray)
              );
              fetchAccountList();
            } catch (error) {
              console.log(error);
            }
          }
        }
      );

      const hash = await mintAccountNft(
        address as string,
        values.username,
        ipfsHash
      );

      if (hash) {
        setTxHash(hash);
        const wait = await waitForTransaction({
          hash: hash as any,
        });
        if (wait) {
          message.success("Transaction success!");
        }
      } else {
        message.error("Transaction error!");
      }
    } catch (error) {
      message.error("Transaction error!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountList = () => {
    const storedData = window.localStorage.getItem("userData");
    if (storedData) {
      const userData = JSON.parse(storedData);
      setAccountCreated(userData);
    }
  };

  const onRemoveToken = (tokenId: string) => {
    const storedData = window.localStorage.getItem("userData");
    if (storedData) {
      const userData: AccountCreated[] = JSON.parse(storedData);

      const updatedUserData = userData.filter(
        (item: AccountCreated) => item.tokenId !== tokenId
      );

      window.localStorage.setItem("userData", JSON.stringify(updatedUserData));

      message.success("Remove success!");

      setAccountCreated(updatedUserData);
    }
  };

  useEffect(() => {
    fetchAccountList();
  }, []);

  return (
    <div className="container flex justify-center">
      {isLoading ? (
        <div className="mt-12 flex justify-center items-center">
          <div className="flex flex-col justify-center gap-8">
            <Spin size="large" />
            {txHash ? (
              <div>
                <p className="mb-2">You transaction in progress...</p>
                <p>
                  Hash:{" "}
                  <a
                    className="underline cursor-pointer hover:text-blue-700"
                    href={`https://mumbai.polygonscan.com/tx/` + txHash}
                    target="_blank"
                  >
                    {shortenAddress(txHash)}
                  </a>
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-8 flex items-start justify-between gap-4">
            <div className="flex-[0.7] bg-[white] rounded-lg p-6">
              <div className="text-2xl font-bold text-black mb-5 w-[500px] flex items-center gap-2">
                <h1>Create Your New Account</h1>
                <Tooltip
                  title="By creating an NFT (ERC721) and storing it in your personal wallet, you can use this NFT account to log into Ether Echelon games. Each NFT Account has its own wallet address to store in-game items and currency. If you transfer this NFT to another personal wallet address, any items in the NFT Account will move with it."
                  placement="bottomLeft"
                >
                  <span className="hover:scale-90 cursor-pointer">
                    <Image
                      src="/icons/question-mark.svg"
                      alt=""
                      width={30}
                      height={30}
                    />
                  </span>
                </Tooltip>
              </div>

              {/* Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
              >
                <span>Username</span>
                <Form.Item name="username" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>

                <span>Character</span>
                <Form.Item name="character" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select the character that will appear in the game"
                    onChange={onCharacterChange}
                  >
                    {Object.keys(charactersData).map((key) => {
                      return (
                        <Option key={key} value={key}>
                          {key}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <button
                    className={
                      "px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all mt-2 " +
                      spaceMono.className
                    }
                    type="submit"
                  >
                    Create
                  </button>
                </Form.Item>
              </Form>
            </div>

            <div className="flex-1 relative">
              <Image
                alt=""
                src={
                  characterImg
                    ? characterImg.inGameImg
                    : "/images/Characters/Undefined.gif"
                }
                width={300}
                height={300}
              />
              <div className="w-[50px] h-[50px] absolute top-4 left-4">
                <Image
                  alt=""
                  src={
                    characterImg
                      ? characterImg.avatarImg
                      : "/images/Characters/Undefined.png"
                  }
                  width={50}
                  height={50}
                />
              </div>
            </div>
          </div>
          {accountCreated?.length != 0 ? (
            <div className="mt-6 p-4 bg-white bg-opacity-80 text-black mb-10">
              The accounts you have created:
              <table className="w-full mt-4 text-left">
                <thead className="border-b border-b-black mb-2">
                  <tr>
                    <th>Username</th>
                    <th>Character</th>
                    <th>TokenId</th>
                  </tr>
                </thead>
                <tbody>
                  {accountCreated?.map((account) => (
                    <tr className="text-sm">
                      <td className="py-4">{account.username}</td>
                      <td className="py-4">{account.character}</td>
                      <td className="py-4">{account.tokenId}</td>
                      <td className="max-w-[100px] ">
                        <button
                          onClick={() => {
                            addTokenToWallet(account.tokenId);
                          }}
                          className="px-2 py-1 border-2 border-black hover:bg-black hover:text-white transition-all text-sm"
                        >
                          Add to wallet
                        </button>
                        <button
                          onClick={() => {
                            onRemoveToken(account.tokenId);
                          }}
                          className="px-2 py-1 border-2 border-black hover:bg-red-400 hover:text-white transition-all text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateAccountPage;
