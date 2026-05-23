import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

/**
 * Use in server components and API routes.
 * Returns the verified session user id.
 * Redirects to /login if JWT exists but user no longer exists in DB.
 */
export async function requireUser(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const exists = await User.exists({ _id: session.user.id });
  if (!exists) redirect("/login");

  return session.user.id;
}
