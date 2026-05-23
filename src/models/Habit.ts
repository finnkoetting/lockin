import mongoose, { Schema, Document, Types } from "mongoose";
import { HABIT_TYPES, type HabitType } from "@/lib/habit-types";

export { HABIT_TYPES, HABIT_LABELS, type HabitType } from "@/lib/habit-types";

export interface IRelapse {
  date: Date;
  note?: string;
}

export interface IHabit extends Document {
  userId: Types.ObjectId;
  type: HabitType;
  startDate: Date;
  why: string;
  costPerUnit?: number;
  dailyAmount?: number;
  relapses: IRelapse[];
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: HABIT_TYPES, required: true },
    startDate: { type: Date, required: true },
    why: { type: String, required: true },
    costPerUnit: { type: Number },
    dailyAmount: { type: Number },
    relapses: [
      {
        date: { type: Date, required: true },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

HabitSchema.index({ userId: 1 });

export const Habit = mongoose.models.Habit ?? mongoose.model<IHabit>("Habit", HabitSchema);
