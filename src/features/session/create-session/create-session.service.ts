import axios from "axios";
import { ClassSessionData } from "../session.type";

const CreateSessionService = async (
  sessionData: ClassSessionData,
) => {
  const response = await axios.post(
    "/api/create-session",
    sessionData,
  );

  return response.data;
};

export default CreateSessionService;