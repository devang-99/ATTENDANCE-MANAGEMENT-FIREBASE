import axios from "axios";
import { StudentAttendanceData } from "../attendances.type";

const MarkAttendanceService = async (
  attendanceData: StudentAttendanceData,
) => {
  const response = await axios.put(
    "/api/put-attendance",
    attendanceData,
  );

  return response.data;
};

export default MarkAttendanceService;