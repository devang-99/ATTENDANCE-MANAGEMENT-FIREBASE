/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import Navbar from "@/components/navbar";

import { GetAttendanceAction } from "@/features/attendances/get-attendances/get-attendances.action";
import { GetSessionsAction } from "@/features/session/get-sessions/get-sessions.action";

import { Role, Subject } from "@/features/users/user.type";

import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";

import AttendanceDot from "@/components/attendance-dot";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const StudentDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentUser } = useAppSelector((state) => state.users);

  const { sessions } = useAppSelector((state) => state.session);

  const { attendances } = useAppSelector((state) => state.attendance);


  useEffect(() => {
    if (currentUser && currentUser.role !== Role.STUDENT) {
      router.push("/auth/sign-in");
    }
  }, [currentUser, router]);


useEffect(() => {
  const sessionsRef = collection(db, "sessions");

  const unsubscribe = onSnapshot(
    sessionsRef,
    () => {
      dispatch(GetSessionsAction());
    },
    (error) => {
      console.error(
        "Session listener error:",
        error,
      );
    },
  );

  return unsubscribe;
}, [dispatch]);


useEffect(() => {
  const attendanceRef = collection(
    db,
    "attendance",
  );

  const unsubscribe = onSnapshot(
    attendanceRef,
    () => {
      dispatch(GetAttendanceAction());
    },
    (error) => {
      console.error(
        "Attendance listener error:",
        error,
      );
    },
  );

  return unsubscribe;
}, [dispatch]);


  const studentSessions = useMemo(() => {
    if (!currentUser?.batch) {
      return [];
    }

    return sessions.filter((session) => session.batch === currentUser.batch);
  }, [sessions, currentUser?.batch]);


  const getAttendance = (sessionId: string) => {
    return attendances.find(
      (attendance) =>
        attendance.sessionId === sessionId &&
        attendance.studentId === currentUser?.id,
    );
  };


  const subjectData = useMemo(() => {
    const data: Record<string, typeof studentSessions> = {};

    studentSessions.forEach((session) => {
      if (!data[session.subject]) {
        data[session.subject] = [];
      }

      data[session.subject].push(session);
    });

    return data;
  }, [studentSessions]);

  const totalSessions = studentSessions.length;

  const markedAttendance = studentSessions.filter((session) =>
    getAttendance(session.id),
  );

  const presentCount = markedAttendance.filter(
    (session) => getAttendance(session.id)?.attendance === "PRESENT",
  ).length;

  const attendancePercentage =
    totalSessions === 0 ? 0 : Math.round((presentCount / totalSessions) * 100);

  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== Role.STUDENT) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
            color="primary"
          >
            My Attendance
          </Typography>

          <Typography color="info">
            Track your attendance across all subjects and sessions.
          </Typography>
        </Box>


        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {currentUser.displayName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {currentUser.email}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <Chip label={currentUser.batch} variant="outlined" />

                {currentUser.stream && (
                  <Chip label={currentUser.stream} variant="outlined" />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>


        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Sessions
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mt: 1,
                  }}
                >
                  {totalSessions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mt: 1,
                  }}
                >
                  {presentCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Attendance
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mt: 1,
                  }}
                >
                  {attendancePercentage}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
           color="primary"
        >
          Subject Attendance
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {Object.values(Subject).map((subject) => {
            const subjectSessions = subjectData[subject] || [];

            if (subjectSessions.length === 0) {
              return null;
            }

            return (
              <Card
                key={subject}
                sx={{
                  borderRadius: 3,
                }}
              >
                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {subject}
                    </Typography>

                    <Chip
                      size="small"
                      label={`${subjectSessions.length} Sessions`}
                    />
                  </Box>


                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    {subjectSessions
                      .sort((a, b) => a.sessionNo - b.sessionNo)
                      .map((session) => {
                        const attendance = getAttendance(session.id);

                        return (
                          <Box
                            key={session.id}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 0.5,
                              minWidth: 65,
                              p: 1,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              S{session.sessionNo}
                            </Typography>

                            <AttendanceDot
                              attendance={attendance?.attendance}
                            />
                          </Box>
                        );
                      })}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {studentSessions.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            No sessions available for your batch yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
