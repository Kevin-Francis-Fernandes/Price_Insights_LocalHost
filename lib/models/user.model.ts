import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: {  type: String, required: true, },
    age:{ type : String , required:true},
    gender:{ type : String , required:true},
    location:{ type : String , required:true},
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
