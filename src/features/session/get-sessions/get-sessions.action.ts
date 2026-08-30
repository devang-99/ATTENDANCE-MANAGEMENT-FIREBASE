import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GetSessionsService from "./get-sessions.service";

export const GetSessionsAction = createAsyncThunk(
  "session/getSessions",
  async (_, thunkAPI) => {
    try {
      console.log("GetSessionsAction Ran");

      const data = await GetSessionsService();

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

      return thunkAPI.rejectWithValue(
        "Something went wrong",
      );
    }
  },
);