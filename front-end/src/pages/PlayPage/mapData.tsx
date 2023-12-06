import professorHourseCollisions from "../../assets/maps/ProfessorHouse/collisionsData";
import collisionsTownData from "../../assets/maps/Town/collisionsData";
import collisionsTown2Data from "../../assets/maps/Town2/conlisionsData";
import { getCollisionsData } from "./utils/utils";

const mapData = {
  ProfessorHouse: {
    lowerSrc: "src/assets/maps/ProfessorHouse/ProfessorHouse.png",
    upperSrc: "src/assets/maps/ProfessorHouse/UpperProfessorHouse.png",
    gameObjects: {},
    walls: getCollisionsData(professorHourseCollisions, 16, 122),
  },
  Town: {
    lowerSrc: "src/assets/maps/Town/Town.png",
    upperSrc: "src/assets/maps/Town/UpperTown.png",
    gameObjects: {},
    walls: getCollisionsData(collisionsTownData, 31, 42),
  },
  Town2: {
    lowerSrc: "src/assets/maps/Town2/Town2.png",
    upperSrc: "src/assets/maps/Town2/UpperTown2.png",
    gameObjects: {},
    walls: getCollisionsData(collisionsTown2Data, 52, 2402),
  },
};

export default mapData;
