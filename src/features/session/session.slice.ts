import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentSession, SessionState } from "./session.type";
import { CreateSessionAction } from "./create-session/create-session.action";
import { GetSessionsAction } from "./get-sessions/get-sessions.action";

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: "session",

  initialState,

  reducers: {
    setCurrentSession: (
      state,
      action: PayloadAction<CurrentSession | null>,
    ) => {
      state.currentSession = action.payload;
    },

    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(GetSessionsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(GetSessionsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
        state.error = null;
      })

      .addCase(GetSessionsAction.rejected, (state, action) => {
        state.loading = false;

        state.error = (action.payload as string) || "Failed to fetch sessions";
      })
      .addCase(CreateSessionAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(CreateSessionAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.error = null;
      })

      .addCase(CreateSessionAction.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create session";
      });
  },
});

export const { setCurrentSession, clearCurrentSession } = sessionSlice.actions;

export default sessionSlice.reducer;
