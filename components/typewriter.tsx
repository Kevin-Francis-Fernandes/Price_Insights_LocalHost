"use client";
import { TypewriterEffect } from "./ui/typewriter-effect";

export function TypewriterEffectDemo() {
  const words = [
   
    // {
    //   text: "Unleash",
    //   className: "text-black dark:text-black-500"
    // },
    // {
    //   text: "the",
    //   className: "text-black dark:text-black-500"
    // },
    // {
    //   text: "Power",
    //   className: "text-black dark:text-black-500"
    // },
    // {
    //   text: "of",
    //   className: "text-black dark:text-black-500"
    // },
    {
      text: "PriceInsights.",
      className: "text-primary dark:text-primary-500",
    },
    
  ];
  return (
    <div className="flex flex-col items-left justify-center h-[4rem] ">
      
      <TypewriterEffect words={words} />
      
    </div>
  );
}
