import { createSlice } from "@reduxjs/toolkit";
import { IAttendance } from "./attendances.type";
import { MarkAttendanceAction } from "./put-attendances/put-attendances.action";
import { GetAttendanceAction } from "./get-attendances/get-attendances.action";

const initialState: IAttendance = {
  attendances: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(MarkAttendanceAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(MarkAttendanceAction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAttendance = action.payload;
        console.log("updatedAttendance ==> ", updatedAttendance);
      })

      .addCase(MarkAttendanceAction.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to mark attendance";
      })
      .addCase(GetAttendanceAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(GetAttendanceAction.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
        state.error = null;
      })

      .addCase(GetAttendanceAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch attendance";
      });
  },
});

export default attendanceSlice.reducer;
