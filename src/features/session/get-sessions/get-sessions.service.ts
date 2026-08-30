import axios from "axios";

const GetSessionsService = async () => {
  const response = await axios.get(
    "/api/get-sessions",
  );

  return response.data;
};

export default GetSessionsService;