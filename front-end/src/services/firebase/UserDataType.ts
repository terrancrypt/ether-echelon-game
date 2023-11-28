export type UserDataType = {
  accountInfor: {
    tokenId: number;
    username: string;
    accountAddr: string;
    ownerAddr: string;
  };
  gameInfor: {
    direction: string;
    position: {
      x: number;
      y: number;
    };
  };
};
