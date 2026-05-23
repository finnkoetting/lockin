import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { requireUser } from "@/lib/session";

export async function PATCH(req: Request) {
  const userId = await requireUser();
  await connectDB();

  const { type, startDate, costPerUnit } = await req.json();
  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (startDate !== undefined) update.startDate = new Date(startDate);
  if (costPerUnit !== undefined) {
    update.costPerUnit = costPerUnit === "" || costPerUnit === null ? undefined : Number(costPerUnit);
  }

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  const habit = await Habit.findOneAndUpdate(
    { userId, type },
    { $set: update },
    { new: true }
  );
  if (!habit) return NextResponse.json({ error: "habit not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
