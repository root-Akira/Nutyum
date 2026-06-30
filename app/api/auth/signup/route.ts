import { NextResponse } from "next/server";
import { createUser } from "@/lib/demo-user-store";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }

    const user = createUser(name, email, password);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (e: any) {
    if (e.message === "User already exists") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
