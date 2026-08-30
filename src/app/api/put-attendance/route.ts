import { Attendance } from "@/features/attendances/attendances.type";
import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { studentId, sessionId, teacherId, attendance } = body;

    if (!studentId || !sessionId || !teacherId || !attendance) {
      return NextResponse.json(
        {
          message: "Missing required attendance data",
        },
        {
          status: 400,
        },
      );
    }

    if (!Object.values(Attendance).includes(attendance)) {
      return NextResponse.json(
        {
          message: "Invalid attendance status",
        },
        {
          status: 400,
        },
      );
    }

    const attendanceId = `${sessionId}_${studentId}`;
    const attendanceRef = doc(db, "attendance", attendanceId);
    const existingAttendance = await getDoc(attendanceRef);
    const now = new Date().toISOString();

    const attendanceData = {
      id: attendanceId,
      studentId,
      sessionId,
      teacherId,
      attendance,

      createdAt: existingAttendance.exists()
        ? existingAttendance.data().createdAt
        : now,

      updatedAt: now,
    };

    await setDoc(attendanceRef, attendanceData, { merge: true });
    return NextResponse.json(attendanceData, {
      status: 200,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);

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
