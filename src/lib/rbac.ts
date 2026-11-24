import type { Role } from "@/db/schema";

export type Action =
  | "learn" // enrol, track progress, submit, earn certificates
  | "review_submissions"
  | "edit_content"
  | "publish_content"
  | "manage_listings" // approve experts / partners / innovation
  | "manage_inquiries"
  | "manage_users";

const grants: Record<Role, readonly Action[]> = {
  STUDENT: ["learn"],
  MENTOR: ["learn", "review_submissions"],
  EDITOR: ["learn", "edit_content"],
  ADMIN: [
    "learn",
    "review_submissions",
    "edit_content",
    "publish_content",
    "manage_listings",
    "manage_inquiries",
    "manage_users",
  ],
};

export function can(role: Role | null | undefined, action: Action): boolean {
  return !!role && grants[role].includes(action);
}

export const roleLabels: Record<Role, string> = {
  STUDENT: "Student",
  MENTOR: "Mentor / lecturer",
  EDITOR: "Content editor",
  ADMIN: "Admin",
};
