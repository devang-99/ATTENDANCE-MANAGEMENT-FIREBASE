export enum Role {
  STUDENT = "student",
  TEACHER = "teacher",
}

export enum Stream {
  "B-TECH" = "B-TECH",
  "M-TECH" = "M-TECH",
  "B-SC" = "B-SC",
  "M-SC" = "M-SC",
}

export enum Batch {
  "2022-2026" = "2022-2026",
  "2023-2027" = "2023-2027",
  "2024-2028" = "2024-2028",
}

export enum Subject {
  English = "English",
  Hindi = "Hindi",
  Math = "Math",
  Science = "Science",
}

type BaseUser = {
  id: string;
  email: string;
  displayName?: string;
};

export type Student = BaseUser & {
  role: Role.STUDENT;
  stream: Stream;
  batch: Batch;
};

export type Teacher = BaseUser & {
  role: Role.TEACHER;
};

type BaseUserData = {
  email: string;
  displayName: string;
};

export type StudentData = BaseUserData & {
  role: Role.STUDENT;
  stream: Stream;
  batch: Batch;
};

export type TeacherData = BaseUserData & {
  role: Role.TEACHER;
};

export type User = Student | Teacher;
export type UserData = StudentData | TeacherData;

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  stream?: Stream;
  batch?: Batch;
};

export type UserState = {
  users: User[];
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
};
