import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Habit, HABIT_TYPES } from "@/models/Habit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const { type, startDate, why, costPerUnit } = await req.json();

  if (!type || !HABIT_TYPES.includes(type)) {
    return NextResponse.json({ error: "Ungültiger Habit-Typ." }, { status: 400 });
  }
  if (!why?.trim()) {
    return NextResponse.json({ error: "Dein Warum fehlt." }, { status: 400 });
  }
  if (!startDate) {
    return NextResponse.json({ error: "Startdatum fehlt." }, { status: 400 });
  }

  await connectDB();

  const existing = await Habit.findOne({ userId: session.user.id });
  if (existing) {
    return NextResponse.json({ error: "Habit bereits angelegt." }, { status: 409 });
  }

  const habit = await Habit.create({
    userId: session.user.id,
    type,
    startDate: new Date(startDate),
    why: why.trim(),
    costPerUnit: costPerUnit ? Number(costPerUnit) : undefined,
    relapses: [],
  });

  return NextResponse.json({ id: habit._id.toString() }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  await connectDB();
  const habit = await Habit.findOne({ userId: session.user.id }).lean();
  if (!habit) return NextResponse.json(null);
  return NextResponse.json(habit);
}
