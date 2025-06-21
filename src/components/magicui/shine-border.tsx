"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode, CSSProperties } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  color?: string[];
  borderWidth?: number;
  duration?: number;
}

const ShineBorder = ({
  children,
  className,
  color = ["#A07CFE", "#FE8A71", "#FED7AA"],
  borderWidth = 2,
  duration = 5,
}: ShineBorderProps) => {
  return (
    <div
      style={
        {
          "--shine-color": color.join(","),
          "--shine-border-width": `${borderWidth}px`,
          "--shine-duration": `${duration}s`,
        } as CSSProperties
      }
      className={cn(
        "relative w-full rounded-lg",
        "before:content-[''] before:w-[calc(100%_+_var(--shine-border-width))] before:h-[calc(100%_+_var(--shine-border-width))] before:p-[--shine-border-width] before:absolute before:-top-[--shine-border-width] before:-left-[--shine-border-width] before:z-[-1]",
        "before:rounded-[inherit] before:bg-[conic-gradient(from_var(--shining-angle),var(--shine-color)_0%,var(--shine-color)_10%,transparent_20%,transparent_80%,var(--shine-color)_90%)]",
        "before:animate-[shine_var(--shine-duration)_linear_infinite]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ShineBorder; 