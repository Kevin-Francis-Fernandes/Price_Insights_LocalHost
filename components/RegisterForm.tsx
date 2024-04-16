"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/utils/cn";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!name || !email || !password || !age || !gender || !location) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          age,
          gender,
          location,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
      Register
    </h2>
    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
      &nbsp;
    </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
          /> */}
          <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Full  Name</Label>
          <Input id="name" placeholder="Name" type="text" onChange={(e) => setName(e.target.value)} />
         </LabelInputContainer>
          {/* <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          /> */}
          <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
         </LabelInputContainer>
          {/* <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          /> */}
          <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" onChange={(e) => setPassword(e.target.value)}/>
        </LabelInputContainer>
          {/* <input
            onChange={(e) => setAge(e.target.value)}
            type="text"
            placeholder="Age"
          /> */}
          <LabelInputContainer className="mb-4">
          <Label htmlFor="age">Age</Label>
          <Input id="age" placeholder="Age" type="text" onChange={(e) => setAge(e.target.value)} />
         </LabelInputContainer>
          {/* <input
            onChange={(e) => setGender(e.target.value.toLowerCase())}
            type="text"
            placeholder="Gender"
          /> */}
            <LabelInputContainer className="mb-4">
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" placeholder="Gender" type="text" onChange={(e) => setGender(e.target.value.toLowerCase())} />
         </LabelInputContainer>
          {/* <input
            onChange={(e) => setLocation(e.target.value.toLowerCase())}
            type="text"
            placeholder="Location"
          /> */}
            <LabelInputContainer className="mb-4">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Location" type="text" onChange={(e) => setLocation(e.target.value.toLowerCase())} />
         </LabelInputContainer>
          <button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Register &rarr;
            <BottomGradient />
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-white" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}




const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
 

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};