"use client";

import {
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { MouseEvent, useState } from "react";

import { User } from "@/features/users/user.type";
import { ClassSession } from "@/features/session/session.type";

import {
  Attendance,
  StudentAttendance,
} from "@/features/attendances/attendances.type";
import { useAppDispatch } from "@/hooks/dispatch";

import { MarkAttendanceAction } from "@/features/attendances/put-attendances/put-attendances.action";
import AttendanceDot from "@/components/attendance-dot";
import {
  clearCurrentSession,
  setCurrentSession,
} from "@/features/session/session.slice";

interface AttendanceTableProps {
  students: User[];
  sessions: ClassSession[];
  attendances: StudentAttendance[];

  teacherId: string;
  currentSessionId?: string;
}

const AttendanceTable = ({
  students,
  sessions,
  attendances,
  teacherId,
  currentSessionId,
}: AttendanceTableProps) => {
  const dispatch = useAppDispatch();

  const [menuPosition, setMenuPosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [sessionMenuPosition, setSessionMenuPosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleSessionContextMenu = (
    event: MouseEvent,
    session: ClassSession,
  ) => {
    event.preventDefault();
    setSelectedSession(session);
    setSessionMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseSessionMenu = () => {
    setSessionMenuPosition(null);
    setSelectedSession(null);
  };

  const handleMakeCurrentSession = () => {
    if (!selectedSession) return;
    dispatch(setCurrentSession(selectedSession));
    handleCloseSessionMenu();
  };

  const handleClearCurrentSession = () => {
    dispatch(clearCurrentSession());
    handleCloseSessionMenu();
  };

  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(
    null,
  );

  const getAttendance = (studentId: string, sessionId: string) => {
    return attendances.find(
      (attendance) =>
        attendance.studentId === studentId &&
        attendance.sessionId === sessionId,
    );
  };

  const handleContextMenu = (
    event: MouseEvent,
    student: User,
    session: ClassSession,
  ) => {
    event.preventDefault();

    if (session.id !== currentSessionId) {
      return;
    }

    setSelectedStudent(student);
    setSelectedSession(session);

    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
    setSelectedStudent(null);
    setSelectedSession(null);
  };

  const handleAttendanceChange = async (attendance: Attendance) => {
    if (!selectedStudent || !selectedSession) {
      return;
    }

    const attendanceData = {
      studentId: selectedStudent.id,
      sessionId: selectedSession.id,
      teacherId,
      attendance,
    };

    try {
      await dispatch(MarkAttendanceAction(attendanceData)).unwrap();
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to update attendance:", error);
    }
  };

  if (sessions.length === 0) {
    return <Typography color="text.secondary">No sessions found.</Typography>;
  }

  if (students.length === 0) {
    return (
      <Typography color="text.secondary">
        No students found for this batch.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 250 + sessions.length * 110,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  minWidth: 220,
                  fontWeight: 600,

                  position: "sticky",
                  left: 0,
                  zIndex: 3,

                  backgroundColor: "background.paper",
                }}
              >
                Student
              </TableCell>

              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;

                return (
                  <TableCell
                    key={session.id}
                    align="center"
                    onContextMenu={(event) =>
                      handleSessionContextMenu(event, session)
                    }
                    sx={{
                      minWidth: 110,

                      backgroundColor: isCurrent
                        ? "action.selected"
                        : "background.paper",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Session {session.sessionNo}
                    </Typography>

                    {isCurrent && (
                      <Typography variant="caption" color="primary">
                        Current
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,

                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {student.displayName}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {student.email}
                  </Typography>
                </TableCell>

                {sessions.map((session) => {
                  const attendance = getAttendance(student.id, session.id);
                  const isCurrent = session.id === currentSessionId;

                  return (
                    <TableCell
                      key={session.id}
                      align="center"
                      onContextMenu={(event) =>
                        handleContextMenu(event, student, session)
                      }
                      sx={{
                        cursor: isCurrent ? "context-menu" : "default",
                        opacity: isCurrent ? 1 : 0.5,

                        backgroundColor: isCurrent
                          ? "action.hover"
                          : "transparent",
                      }}
                    >
                      <AttendanceDot attendance={attendance?.attendance} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        open={menuPosition !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition
            ? {
                top: menuPosition.mouseY,
                left: menuPosition.mouseX,
              }
            : undefined
        }
      >
        <MenuItem onClick={() => handleAttendanceChange(Attendance.PRESENT)}>
          <AttendanceDot attendance={Attendance.PRESENT} />

          <Typography sx={{ ml: 1 }}>Present</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleAttendanceChange(Attendance.ABSENT)}>
          <AttendanceDot attendance={Attendance.ABSENT} />

          <Typography sx={{ ml: 1 }}>Absent</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleAttendanceChange(Attendance.LATE)}>
          <AttendanceDot attendance={Attendance.LATE} />

          <Typography sx={{ ml: 1 }}>Late</Typography>
        </MenuItem>
      </Menu>

      <Menu
        open={sessionMenuPosition !== null}
        onClose={handleCloseSessionMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          sessionMenuPosition
            ? {
                top: sessionMenuPosition.mouseY,
                left: sessionMenuPosition.mouseX,
              }
            : undefined
        }
      >
        <MenuItem
          disabled={selectedSession?.id === currentSessionId}
          onClick={handleMakeCurrentSession}
        >
          Make Current Session
        </MenuItem>

        <MenuItem
          disabled={selectedSession?.id !== currentSessionId}
          onClick={handleClearCurrentSession}
        >
          Clear Current Session
        </MenuItem>
      </Menu>
    </>
  );
};

export default AttendanceTable;
