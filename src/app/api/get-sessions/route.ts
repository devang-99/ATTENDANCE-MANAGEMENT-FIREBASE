import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const colRef = collection(db, "sessions");
    const sessions = await getDocs(colRef);
    const sessionsList = sessions.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(sessionsList);
  } catch (error) {
    console.error("Error fetching sessions:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}