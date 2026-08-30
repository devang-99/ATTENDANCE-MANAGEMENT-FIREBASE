"use client";

import Navbar from "@/components/navbar";
import { GetAttendanceAction } from "@/features/attendances/get-attendances/get-attendances.action";
import { GetSessionsAction } from "@/features/session/get-sessions/get-sessions.action";
import { GetUsersAction } from "@/features/users/get-users/get-users.action";
import { Role } from "@/features/users/user.type";
import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AttendanceList from "./components/attendance-list";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const TeacherDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentUser, users } = useAppSelector((state) => state.users);
  const { attendances } = useAppSelector((state) => state.attendance);
  const { sessions } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (currentUser && currentUser.role !== Role.TEACHER) {
      router.push("/auth/sign-in");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(GetUsersAction());
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const attendanceRef = collection(db, "attendance");
    const unsubscribe = onSnapshot(attendanceRef, () => {
      const fetchAttendance = async () => {
        await dispatch(GetAttendanceAction());
      };
      fetchAttendance();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      await dispatch(GetSessionsAction());
    };
    fetchSessions();
  }, []);

  if (!currentUser) {
    return null;
  }
  if (currentUser.role !== Role.TEACHER) {
    return null;
  }
  if (!currentUser.id) {
    return null;
  }

  return (
    <div>
      <Navbar currentUser={currentUser} />
      <AttendanceList
        users={users}
        attendances={attendances}
        teacherId={currentUser.id}
        sessions={sessions}
      />
    </div>
  );
};

export default TeacherDashboard;
