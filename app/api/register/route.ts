import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req:any) {
  try {
    const { name, email, password ,age,gender,location} = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectToDB();
    await User.create({ name, email, password: hashedPassword ,age,gender,location});

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
