import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { User } from "@/models/User";
import { requireUser } from "@/lib/session";

export async function DELETE() {
  const userId = await requireUser();
  await connectDB();

  await Habit.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  return NextResponse.json({ ok: true });
}
