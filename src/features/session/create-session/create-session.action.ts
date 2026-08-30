import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CreateSessionService from "./create-session.service";
import { ClassSessionData } from "../session.type";

export const CreateSessionAction = createAsyncThunk(
  "session/createSession",
  async (sessionData: ClassSessionData, thunkAPI) => {
    try {
      console.log("CreateSessionAction Ran");
      const data = await CreateSessionService(sessionData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message;

        return thunkAPI.rejectWithValue(errorMessage);
      }

      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      console.error("An unexpected error occurred");

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);