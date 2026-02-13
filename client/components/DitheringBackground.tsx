"use client";

import { Dithering } from "@paper-design/shaders-react";

interface DitherBackgroundProps {
  colorBack?: string;
  colorFront?: string;
  shape?: "simplex" | "warp" | "dots" | "wave" | "ripple" | "swirl" | "sphere";
  type?: "random" | "2x2" | "4x4" | "8x8";
  size?: number;
  speed?: number;
  scale?: number;
  className?: string;
}

export function DitherBackground({
  colorBack = "#1a1625",
  colorFront = "#e84a8a",
  shape = "warp",
  type = "4x4",
  size = 3,
  speed = 0.3,
  scale = 1,
  className = "",
}: DitherBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Dithering
        colorBack={colorBack}
        colorFront={colorFront}
        shape={shape}
        type={type}
        size={size}
        speed={speed}
        scale={scale}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
