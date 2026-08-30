import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { Role, UserData } from "../user.type";

export type RegisterUserData = UserData & {
  password: string;
};

const CustomSignUpService = async (userData: RegisterUserData) => {
  const { email, password,...profileData} = userData;
  const response = await createUserWithEmailAndPassword(auth, email, password);
  console.log(response.user, "Response from createUserWithEmailAndPassword");

  if (response) {
    if (userData.role === Role.STUDENT) {
      await setDoc(doc(db, "users", response.user.uid), {
        email,
        displayName:userData.displayName,
        role: userData.role,
        stream: userData.stream,
        batch: userData.batch,
      });
    }

    if (userData.role === Role.TEACHER) {
      await setDoc(doc(db, "users", response.user.uid), {
        email,
        displayName:userData.displayName,
        role: userData.role,
      });
    }
  }

  Cookies.set("currentUser", response.user.uid, { expires: 7, secure: true });

  const cleanData = {
    id: response.user.uid,
    email: email,
    ...profileData
  };
  return cleanData;
};

export default CustomSignUpService;
