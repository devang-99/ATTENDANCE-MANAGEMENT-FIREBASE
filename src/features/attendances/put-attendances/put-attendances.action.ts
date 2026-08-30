import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { StudentAttendanceData } from "../attendances.type";
import MarkAttendanceService from "./put-attendances.service";

export const MarkAttendanceAction = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData: StudentAttendanceData, thunkAPI) => {
    try {
      console.log("MarkAttendanceAction Ran");
      const data = await MarkAttendanceService(attendanceData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
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
