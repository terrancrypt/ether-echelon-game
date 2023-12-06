export type UserDataType = {
  accountInfor: {
    tokenId: number;
    username: string;
    accountAddr: string;
    ownerAddr: string;
  };
  gameInfor: {
    character: string;
    direction: string;
    position: {
      x: number;
      y: number;
    };
    movingProgressRemaining: number;
  };
};
