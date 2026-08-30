import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const attendanceRef = collection(db, "attendance");
    const attendanceSnapshot = await getDocs(attendanceRef);
    const attendanceList = attendanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(attendanceList, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);

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
