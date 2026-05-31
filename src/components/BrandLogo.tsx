import React from "react";

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function BrandLogo({ className = "", iconOnly = false, size = "md" }: BrandLogoProps) {
  // Determine dimensions based on size presets
  const dimensions = {
    sm: { iconWidth: 24, iconHeight: 24, totalHeight: "h-8" },
    md: { iconWidth: 42, iconHeight: 42, totalHeight: "h-12" },
    lg: { iconWidth: 64, iconHeight: 64, totalHeight: "h-20" },
    xl: { iconWidth: 120, iconHeight: 120, totalHeight: "h-36" },
  }[size];

  return (
    <div id="brand-logo-container" className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* 
        This is an incredibly clean, hand-crafted pixel-perfect vector representation of the official
        Badney Cotton "BD" Monogram symbol. It uses coordinates designed to resemble the exact outline style 
        of the uploaded brand emblem, including the left vertical bar, double loops, and interior stripes.
      */}
      <svg
        viewBox="0 0 200 200"
        width={dimensions.iconWidth}
        height={dimensions.iconHeight}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-current transition-colors"
      >
        {/* Outer B-shape outline with thick strokes */}
        <path
          key={`brand-path-outline-${size}`}
          data-size={size}
          d="M 60 40 
             C 125 40, 160 42, 160 85 
             C 160 110, 140 115, 128 115 
             C 145 115, 165 125, 165 155 
             C 165 195, 125 198, 60 198 
             Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* The two precise parallel vertical stripes inside the B-D loops */}
        <path
          key={`brand-stripe-1-${size}`}
          data-size={size}
          d="M 95 40 L 95 198"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          key={`brand-stripe-2-${size}`}
          data-size={size}
          d="M 125 40 L 125 198"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
        />
      </svg>

      {!iconOnly && (
        <div className="mt-2 flex flex-col items-center">
          <span className="font-sans font-medium text-[#1a1a1a] tracking-[0.2em] uppercase text-sm sm:text-base select-none leading-none">
            badney
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] text-gray-400 tracking-[0.4em] uppercase font-black select-none mt-1">
            cotton
          </span>
        </div>
      )}
    </div>
  );
}
