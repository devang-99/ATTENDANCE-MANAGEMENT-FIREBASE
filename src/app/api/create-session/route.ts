import { db } from "@/firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionNo, batch, teacherId , subject} = body;

    if (sessionNo === undefined || !batch || !teacherId || !subject) {
      return NextResponse.json(
        {
          message: "Missing required session data",
        },
        {
          status: 400,
        },
      );
    }

    const sessionRef = doc(collection(db, "sessions"));

    const sessionData = {
      id: sessionRef.id,
      sessionNo,
      subject,
      batch,
      teacherId,
      createdAt: new Date().toISOString(),
    };

    await setDoc(sessionRef, sessionData);
    return NextResponse.json(sessionData, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating session:", error);
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
