import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GetAttendanceService from "./get-attendances.service";

export const GetAttendanceAction = createAsyncThunk(
  "attendance/getAttendance",
  async (_, thunkAPI) => {
    try {
      console.log("GetAttendanceAction Ran");
      const data = await GetAttendanceService();
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