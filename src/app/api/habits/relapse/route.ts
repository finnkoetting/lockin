import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { requireUser } from "@/lib/session";

export async function POST(req: Request) {
  const userId = await requireUser();
  await connectDB();

  const { type, note } = await req.json();
  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });

  const habit = await Habit.findOne({ userId, type });
  if (!habit) return NextResponse.json({ error: "habit not found" }, { status: 404 });

  habit.relapses.push({ date: new Date(), note: note?.trim() || undefined });
  await habit.save();

  return NextResponse.json({ ok: true });
}
