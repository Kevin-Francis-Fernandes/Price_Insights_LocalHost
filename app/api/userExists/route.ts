import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req:any) {
  try {
    await connectToDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    console.log("user: ", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
