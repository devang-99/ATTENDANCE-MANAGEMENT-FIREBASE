export enum Attendance {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
}

export interface StudentAttendance {
  id:string,
  studentId : string,
  sessionId : string;
  teacherId : string,
  attendance : Attendance,
  createdAt : string,
}

export interface StudentAttendanceData {
  studentId : string,
  sessionId: string;
  teacherId : string,
  attendance : Attendance,
}

export interface IAttendance {
  attendances : StudentAttendance[],
  loading : boolean | null ,
  error : string | null ,
}