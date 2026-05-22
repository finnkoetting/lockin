import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Alle Felder ausfüllen." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Passwort mindestens 8 Zeichen." }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "E-Mail bereits registriert." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashed });

  return NextResponse.json({ ok: true }, { status: 201 });
}
