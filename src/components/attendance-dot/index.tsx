"use client"

import { Box } from "@mui/material";
import { Attendance } from "@/features/attendances/attendances.type";

interface AttendanceDotProps {
  attendance?: Attendance;
}

const AttendanceDot = ({
  attendance,
}: AttendanceDotProps) => {
  const getColor = () => {
    switch (attendance) {
      case Attendance.PRESENT:
        return "success.main";

      case Attendance.ABSENT:
        return "error.main";

      case Attendance.LATE:
        return "warning.main";

      default:
        return "transparent";
    }
  };

  return (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",

        backgroundColor:
          getColor(),

        border: "1.5px solid",
        borderColor:
          attendance
            ? getColor()
            : "divider",

        margin: "auto",
      }}
    />
  );
};

export default AttendanceDot;