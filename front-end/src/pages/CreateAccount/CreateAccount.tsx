import { Form, Select, Input, message, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAccount,
  waitForTransaction,
  watchContractEvent,
} from "wagmi/actions";
import { formatUnits } from "viem";
import { shortenAddr } from "../../utils/addrUtils";
import { addTokenToWallet } from "../../utils/metamask";
import { charactersData } from "../../data/charaters";
import { createAccountNftWithAddress } from "../../services/contract-services/EngineServ";
import dataContract from "../../services/contract-services/dataContract";
import { ERC6551_REGISTRY_CONTRACT } from "../../services/contract-services/constants";
import { getTokenUri } from "../../services/contract-services/AccountNftServ";

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
  accountAddr: string;
}

const CreateAccountPage: React.FC = () => {
  const [form] = Form.useForm();
  const { isConnected, address } = getAccount();
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

  watchContractEvent(
    {
      address: dataContract[ERC6551_REGISTRY_CONTRACT].address as any,
      abi: dataContract[ERC6551_REGISTRY_CONTRACT].abi,
      eventName: "AccountCreated",
    },
    async (log: any) => {
      try {
        const storedData = window.localStorage.getItem("userData");
        const userDataArray = storedData ? JSON.parse(storedData) : [];
        const newAccount = localStorage.getItem("newAccount");
        const newAccountArray = newAccount ? JSON.parse(newAccount) : [];
        const tokenId = formatUnits(log[0].args.tokenId, 0);

        const isTokenExists = userDataArray.some(
          (obj: any) => obj.tokenId === tokenId
        );

        if (!isTokenExists) {
          const newData = {
            accountAddress: log[0].args.account,
            tokenId: tokenId,
          };
          userDataArray.push(newData);
          window.localStorage.setItem(
            "userData",
            JSON.stringify(userDataArray)
          );
          newAccountArray.push(tokenId);
          localStorage.setItem("newAccount", JSON.stringify(newAccountArray));
          await fetchUserData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  const onFinish = async (values: AccountInfor) => {
    setIsLoading(true);
    try {
      const { ipfsHash } = charactersData[values.character];

      const hash = await createAccountNftWithAddress(values.username, ipfsHash);

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
      console.log(error);
      message.error("Transaction error!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    const storedData = window.localStorage.getItem("userData");
    if (storedData) {
      let userDataArray = JSON.parse(storedData);

      // Sử dụng Set để loại bỏ các tokenId trùng lặp
      const uniqueTokenIds = new Set();

      // Duyệt qua mảng để thêm mới các phần tử vào uniqueTokenIds
      for (const object of userDataArray) {
        const tokenId = object.tokenId;
        uniqueTokenIds.add(tokenId);
      }

      // Tạo một mảng mới từ uniqueTokenIds để giữ các tokenId duy nhất
      const uniqueUserDataArray = Array.from(uniqueTokenIds).map(
        async (tokenId: any) => {
          const tokenUri = await getTokenUri(tokenId);
          const splitUrl = tokenUri.image.split("/");
          const imgHash = splitUrl.pop();

          const character =
            Object.keys(charactersData).find(
              (key) => charactersData[key].ipfsHash === imgHash
            ) || null;

          return {
            tokenId: tokenId,
            character: character,
            accountAddr: tokenUri.accountAddr,
            username: tokenUri.userName,
          };
        }
      );

      // Đợi tất cả các promise trong uniqueUserDataArray hoàn thành
      const resolvedUniqueUserDataArray = await Promise.all(
        uniqueUserDataArray
      );

      // Cập nhật lại localStorage với mảng đã loại bỏ tokenId trùng lặp
      window.localStorage.setItem(
        "userData",
        JSON.stringify(resolvedUniqueUserDataArray)
      );

      setAccountCreated(resolvedUniqueUserDataArray as any);
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
    fetchUserData();
  }, [isConnected, address]);

  return (
    <>
      {isConnected ? (
        <div className="container flex justify-center tracking-tighter">
          {isLoading ? (
            <div className="mt-12 flex justify-center items-center">
              <div className="flex flex-col justify-center gap-8">
                <Spin size="large" />
                {txHash ? (
                  <div className="text-[12px]">
                    <p className="mb-2">Your transaction in progress...</p>
                    <p>
                      Hash:{" "}
                      <a
                        className="underline cursor-pointer hover:text-blue-700"
                        href={`https://mumbai.polygonscan.com/tx/` + txHash}
                        target="_blank"
                      >
                        {shortenAddr(txHash)}
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
                  <div className="text-sm font-bold text-black mb-5 w-[500px] flex items-center gap-2">
                    <h1>Create Your New Account</h1>
                    <Tooltip
                      title="By creating an NFT (ERC721) and storing it in your personal wallet, you can use this NFT account to log into Ether Echelon games. Each NFT Account has its own wallet address to store in-game items and currency. If you transfer this NFT to another personal wallet address, any items in the NFT Account will move with it."
                      placement="bottomLeft"
                    >
                      <span className="hover:scale-90 cursor-pointer">
                        <img
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
                    className="text-xs"
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
                          "px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all mt-2 "
                        }
                        type="submit"
                      >
                        Create
                      </button>
                    </Form.Item>
                  </Form>
                </div>

                <div className="flex-1 relative">
                  <img
                    alt=""
                    src={
                      characterImg
                        ? characterImg.inGameImg
                        : "/images/characters/Undefined.gif"
                    }
                    width={300}
                    height={300}
                  />
                  <div className="w-[50px] h-[50px] absolute top-4 left-4">
                    <img
                      alt=""
                      src={
                        characterImg
                          ? characterImg.avatarImg
                          : "/images/characters/Undefined.png"
                      }
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
              </div>
              {accountCreated?.length != 0 && accountCreated != null ? (
                <div className="mt-6 p-4 bg-white bg-opacity-80 text-black mb-10 text-sm">
                  The accounts you have created:
                  <table className="w-full mt-4 text-left text-[10px]">
                    <thead className="border-b border-b-black mb-2">
                      <tr>
                        <th>Username</th>
                        <th>Character</th>
                        <th>TokenId</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountCreated?.map((account, index) => (
                        <tr className="text-[10px]" key={index}>
                          <td className="py-4">{account.username}</td>
                          <td className="py-4">{account.character}</td>
                          <td className="py-4">{account.tokenId}</td>
                          <td className="max-w-[100px] text-[10px]">
                            <button
                              onClick={() => {
                                addTokenToWallet(account.tokenId);
                              }}
                              className="px-2 py-1 border-2 border-black hover:bg-black hover:text-white transition-all"
                            >
                              Add to wallet
                            </button>
                            <button
                              onClick={() => {
                                onRemoveToken(account.tokenId);
                              }}
                              className="px-2 py-1 border-2 border-black hover:bg-red-400 hover:text-white transition-all"
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
      ) : (
        <p className="text-center pt-10">Please connect your wallet</p>
      )}
    </>
  );
};

export default CreateAccountPage;
