import React from "react";

export function Logo({ className = "h-8 w-auto", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="240" height="240" rx="48" fill="url(#pafyra-grad)" />
        <path
          d="M60 70C60 64.4772 64.4772 60 70 60H120C147.614 60 170 82.3858 170 110C170 137.614 147.614 160 120 160H80V170C80 175.523 75.5228 180 70 180C64.4772 180 60 175.523 60 170V70ZM120 140C136.569 140 150 126.569 150 110C150 93.4315 136.569 80 120 80H80V140H120Z"
          fill="white"
        />
        <circle cx="175" cy="175" r="25" fill="#10B981" />
        <defs>
          <linearGradient id="pafyra-grad" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
          Pafyra<span className="text-primary">.</span>
        </span>
      )}
    </div>
  );
}
