import { Batch, Subject } from "../users/user.type";

export interface ClassSession {
  id: string;
  sessionNo: number;
  batch: Batch;
  subject:Subject;
  teacherId: string;
  createdAt: string;
}

export interface ClassSessionData {
  sessionNo: number;
  subject:Subject;
  batch: Batch;
  teacherId: string;
}

export interface CurrentSession {
  id: string;
  sessionNo: number;
  subject:Subject;
  batch: Batch;
  teacherId: string;
  createdAt: string;
}

export interface SessionState {
  sessions: ClassSession[];
  currentSession:CurrentSession | null;
  loading: boolean;
  error: string | null;
}
