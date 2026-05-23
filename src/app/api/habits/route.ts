import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Habit, HABIT_TYPES } from "@/models/Habit";

interface HabitInput {
  type: string;
  why: string;
  costPerUnit?: number;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const { startDate, habits } = await req.json() as {
    startDate: string;
    habits: HabitInput[];
  };

  if (!startDate) {
    return NextResponse.json({ error: "Startdatum fehlt." }, { status: 400 });
  }
  if (!Array.isArray(habits) || habits.length === 0) {
    return NextResponse.json({ error: "Mindestens ein Laster erforderlich." }, { status: 400 });
  }

  for (const h of habits) {
    if (!HABIT_TYPES.includes(h.type as never)) {
      return NextResponse.json({ error: `Ungültiger Typ: ${h.type}` }, { status: 400 });
    }
    if (!h.why?.trim()) {
      return NextResponse.json({ error: `Warum fehlt für ${h.type}.` }, { status: 400 });
    }
  }

  await connectDB();

  const userId = session.user.id;
  const parsedDate = new Date(startDate);

  // Upsert one Habit document per type
  await Promise.all(
    habits.map((h) =>
      Habit.findOneAndUpdate(
        { userId, type: h.type },
        {
          $set: {
            startDate: parsedDate,
            why: h.why.trim(),
            costPerUnit: h.costPerUnit ?? undefined,
          },
          $setOnInsert: { relapses: [] },
        },
        { upsert: true, new: true }
      )
    )
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  await connectDB();
  const habits = await Habit.find({ userId: session.user.id }).lean();
  return NextResponse.json(habits);
}
