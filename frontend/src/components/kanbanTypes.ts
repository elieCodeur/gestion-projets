export type Status = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Project {
  id: string;
  title: string;
  description: string;
  owner: "teacher" | "student";
  status: Status;
  priority: Priority;
}

export interface Column {
  id: string;
  title: string;
  status: Status;
}
