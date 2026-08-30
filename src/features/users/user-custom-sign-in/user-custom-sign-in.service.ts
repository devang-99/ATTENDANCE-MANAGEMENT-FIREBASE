import { auth, db } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { CurrentUser } from "../user.type";

const CustomSignInService = async (userData: {
  email: string;
  password: string;
}): Promise<CurrentUser> => {
  const { email, password } = userData;
  const response = await signInWithEmailAndPassword(auth, email, password);
  console.log(response.user, "Response from signInWithEmailAndPassword");

  const docRef = doc(db, "users", response.user.uid);
  const currentUserSnap = await getDoc(docRef);
  if (!currentUserSnap.exists()) {
    throw new Error("User profile not found");
  }

  const currentUserData = currentUserSnap.data();

  console.log("Current User From Firestore:", currentUserData);

  Cookies.set("currentUser", response.user.uid, { expires: 7, secure: true });
  Cookies.set("userRole", currentUserData.role, { expires: 7, secure: true });

  const cleanData = {
    id: response.user.uid,
    email: email,
    displayName: currentUserData.displayName,
    role: currentUserData.role,
    stream: currentUserData.stream,
    batch: currentUserData.batch,
  };

  return cleanData;
};

export default CustomSignInService;
