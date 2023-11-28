import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  DatabaseReference,
  child,
  get,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  set,
} from "firebase/database";
import { UserDataType } from "./UserDataType";
import initGame from "../../pages/GamePage/game-logic/initGame";

const firebaseConfig = {
  apiKey: "AIzaSyDjJSw7Itcf21WeBk8BrCXybzvicmd5H3E",
  authDomain: "ether-echelon.firebaseapp.com",
  databaseURL: "https://ether-echelon-default-rtdb.firebaseio.com",
  projectId: "ether-echelon",
  storageBucket: "ether-echelon.appspot.com",
  messagingSenderId: "258587455716",
  appId: "1:258587455716:web:487d817610b97d6494fcf1",
  measurementId: "G-1XEWMTDKMT",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let playerRef: DatabaseReference;
let playerId: string;

export function initFireBase() {
  const auth = getAuth(app);
  signInAnonymously(auth)
    .then(() => {
      console.log("Login Success!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error code: ", errorCode);
      console.log("Error message: ", errorMessage);
    });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      playerId = user.uid;

      playerRef = ref(db, `players/${playerId}`);

      onDisconnect(playerRef).remove();

      readUserData();
    } else {
      console.log("You logout");
    }
  });
}

export function writeUserData(userData: UserDataType) {
  set(playerRef, {
    tokenId: userData.accountInfor.tokenId,
    username: userData.accountInfor.username,
    address: userData.accountInfor.accountAddr,
    character: userData.accountInfor.ownerAddr,
    direction: userData.gameInfor.direction,
    position: {
      x: userData.gameInfor.position.x,
      y: userData.gameInfor.position.y,
    },
  });
}

export function readUserData() {
  const allPlayerRef = ref(db, "players");
  console.log(allPlayerRef);
}
