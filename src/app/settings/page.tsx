import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { requireUser } from "@/lib/session";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const userId = await requireUser();
  await connectDB();

  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  const habitData = habits.map((h) => ({
    type: h.type,
    startDate: h.startDate.toISOString(),
    costPerUnit: h.costPerUnit,
    dailyAmount: h.dailyAmount,
  }));

  return (
    <main className="flex flex-1 flex-col px-6 py-8 max-w-lg mx-auto w-full gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
            LockIn
          </p>
          <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">
            Einstellungen
          </p>
        </div>
        <Link
          href="/dashboard"
          className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          ← Zurück
        </Link>
      </div>

      <SettingsForm habits={habitData} />
    </main>
  );
}
