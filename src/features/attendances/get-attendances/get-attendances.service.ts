import axios from "axios";

const GetAttendanceService = async () => {
  const response = await axios.get(
    "/api/get-attendances",
  );

  return response.data;
};

export default GetAttendanceService;