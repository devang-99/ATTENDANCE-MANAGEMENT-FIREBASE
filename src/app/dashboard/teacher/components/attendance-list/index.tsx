"use client";

import { Box } from "@mui/material";
import { useMemo, useState } from "react";

import {
  Batch,
  Role,
  Subject,
  User,
} from "@/features/users/user.type";

import { ClassSession } from "@/features/session/session.type";
import { StudentAttendance } from "@/features/attendances/attendances.type";

import { useAppSelector } from "@/hooks/selector";

import AttendanceFilters from "./attendance-filters";
import AttendanceTable from "./attendance-table";

import styles from "./style.module.css";

export interface AttendanceListProps {
  users: User[];
  attendances: StudentAttendance[];
  sessions: ClassSession[];
  teacherId: string;
}

const AttendanceList = ({
  users,
  attendances,
  sessions,
  teacherId,
}: AttendanceListProps) => {
  const [selectedBatch, setSelectedBatch] =
    useState<Batch | "">("");

  const [selectedSubject, setSelectedSubject] =
    useState<Subject | "">("");

  const { currentSession } =
    useAppSelector(
      (state) => state.session,
    );

  const handleFilterChange = (
    batch: Batch | "",
    subject: Subject | "",
  ) => {
    setSelectedBatch(batch);
    setSelectedSubject(subject);
  };

  const students = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }

    return users.filter(
      (user) =>
        user.role === Role.STUDENT &&
        user.batch === selectedBatch,
    );
  }, [users, selectedBatch]);

  const filteredSessions = useMemo(() => {
    if (
      !selectedBatch ||
      !selectedSubject
    ) {
      return [];
    }

    return sessions.filter(
      (session) =>
        session.teacherId === teacherId &&
        session.batch === selectedBatch &&
        session.subject === selectedSubject,
    );
  }, [
    sessions,
    teacherId,
    selectedBatch,
    selectedSubject,
  ]);

  return (
    <Box className={styles.container}>
      <Box className={styles.filters}>
        <AttendanceFilters
          selectedBatch={selectedBatch}
          selectedSubject={selectedSubject}
          onFilterChange={handleFilterChange}
        />
      </Box>

      {selectedBatch &&
        selectedSubject && (
          <Box className={styles.tableSection}>
            <AttendanceTable
              students={students}
              sessions={filteredSessions}
              attendances={attendances}
              teacherId={teacherId}
              currentSessionId={
                currentSession?.id
              }
            />
          </Box>
        )}
    </Box>
  );
};

export default AttendanceList;