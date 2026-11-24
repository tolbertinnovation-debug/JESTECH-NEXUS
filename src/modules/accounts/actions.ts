"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";
import { safeNext } from "@/lib/format";
import { hashPassword, verifyPassword } from "@/lib/password";

export type AuthState = { errors?: Record<string, string>; values?: { name?: string; email?: string } };

const email = z.email("Enter a valid email address").trim().toLowerCase().max(200);

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email,
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(formData);
  const parsed = registerSchema.safeParse(raw);
  const values = { name: String(raw.name ?? ""), email: String(raw.email ?? "") };
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (existing) return { errors: { email: "An account with this email already exists. Log in instead." }, values };

  const [user] = await db
    .insert(users)
    .values({ name: parsed.data.name, email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password) })
    .returning({ id: users.id });
  await createSession(user!.id);
  redirect(safeNext(formData.get("next")));
}

const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password").max(200) });

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(formData);
  const values = { email: String(raw.email ?? "") };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, values };
  }
  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);
  // Same message whether the email or password is wrong, so accounts can't be discovered.
  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : await verifyPassword("x", "scrypt$00$00");
  if (!user || !ok) return { errors: { form: "Email or password is incorrect." }, values };

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
