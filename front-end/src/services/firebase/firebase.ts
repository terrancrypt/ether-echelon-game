import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  DatabaseReference,
  getDatabase,
  onDisconnect,
  ref,
  set,
} from "firebase/database";
import { UserDataType } from "./UserDataType";

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
const auth = getAuth(app);
const db = getDatabase(app);
let playerRef: DatabaseReference;
let playerId: string;

function initFireBase() {
  signInAnonymously(auth)
    .then(() => {})
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error code: ", errorCode);
      console.log("Error message: ", errorMessage);
    });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("You are logged in!");
    playerId = user.uid;
    playerRef = ref(db, `players/${playerId}`);
    onDisconnect(playerRef).remove();
  } else {
    console.log("You logout");
  }
});

function writeUserData({ accountInfor, gameInfor }: UserDataType) {
  set(playerRef, {
    accountInfor: {
      playerId: playerId,
      tokenId: accountInfor.tokenId,
      username: accountInfor.username,
      accountAddr: accountInfor.accountAddr,
      ownerAddr: accountInfor.ownerAddr,
    },
    gameInfor: {
      character: gameInfor.character,
      direction: gameInfor.direction,
      position: {
        x: gameInfor.position.x,
        y: gameInfor.position.y,
      },
    },
  });
}

export { db, initFireBase, writeUserData };
