import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const habit = await Habit.findOne({ userId: session.user.id }).lean();
  if (!habit) redirect("/onboarding");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
          Eingeloggt als
        </p>
        <p className="font-mono text-lg">{session.user?.name}</p>
        <p className="font-mono text-xs text-[var(--color-muted)] mt-1">{session.user?.email}</p>
        <p className="mt-8 font-mono text-xs text-[var(--color-muted)]">
          Dashboard — Streak kommt als nächstes.
        </p>
      </div>
    </main>
  );
}
