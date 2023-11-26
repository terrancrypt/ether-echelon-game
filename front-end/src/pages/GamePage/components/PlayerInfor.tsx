const PlayerInfor = () => {
  return (
    <div className="absolute top-2 left-3">
      <div className="relative hover:scale-90 cursor-pointer">
        <img
          width={60}
          height={60}
          src="/images/GUI/Box_Orange_Rounded.png"
          alt=""
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <img
            className="w-[40px] h-[40px]"
            src="/images/GUI/Person.png"
            alt=""
          />
        </div>
      </div>
      <div className="relative mt-2 hover:scale-90 cursor-pointer">
        <img
          width={60}
          height={60}
          src="/images/GUI/Box_Orange_Rounded.png"
          alt=""
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <img className="w-[40px] h-[40px]" src="/images/GUI/Bag.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default PlayerInfor;
