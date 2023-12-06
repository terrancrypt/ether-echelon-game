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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const realtimeDatabase = getDatabase(app);

let playerRef: DatabaseReference;
export let playerId: string;

export async function initFireBase() {
  try {
    await signInAnonymously(auth);

    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          playerId = user.uid;

          playerRef = ref(realtimeDatabase, `players/${playerId}`);

          onDisconnect(playerRef).remove();

          resolve();
          unsubscribe();
        }
      });
    });
  } catch (error) {
    console.error("Error during Firebase initialization:", error);
  }
}

export function writeUserData(userData: UserDataType) {
  set(playerRef, {
    id: playerId,
    tokenId: userData.accountInfor.tokenId,
    username: userData.accountInfor.username,
    address: userData.accountInfor.accountAddr,
    character: userData.gameInfor.character,
    direction: userData.gameInfor.direction,
    position: {
      x: userData.gameInfor.position.x,
      y: userData.gameInfor.position.y,
    },
  });
}
