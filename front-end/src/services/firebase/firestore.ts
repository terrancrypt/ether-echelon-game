import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "./firebase";

const fireStoreDB = getFirestore(app);

const getAllDataFromFirestore = async () => {
  try {
    const accountRef = collection(fireStoreDB, "accounts");
    const result = await getDocs(accountRef);
    const data = result.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const addDocToFireStore = async (tokenId: number, accountAddr: string) => {
  try {
    const accountRef = collection(fireStoreDB, "accounts");
    await addDoc(accountRef, {
      tokenId: tokenId,
      accountAddr,
    });
  } catch (error) {
    console.log(error);
  }
};

export { getAllDataFromFirestore, addDocToFireStore };
