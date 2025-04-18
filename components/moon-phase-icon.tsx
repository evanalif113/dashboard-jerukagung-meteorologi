"use client"

import { cn } from "@/lib/utils"

type MoonPhaseType =
  | "new-moon"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full-moon"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent"

interface MoonPhaseIconProps {
  phase: MoonPhaseType
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function MoonPhaseIcon({ phase, size = "md", className }: MoonPhaseIconProps) {
  // Size classes for the moon container
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  }

  // Render different moon phases using CSS
  const renderMoonPhase = () => {
    switch (phase) {
      case "new-moon":
        return (
          <div className="relative w-full h-full rounded-full bg-slate-800 border border-slate-700 shadow-inner">
            {/* New moon is completely dark */}
          </div>
        )

      case "waxing-crescent":
        return (
          <div className="relative w-full h-full">
            {/* Dark circle background */}
            <div className="absolute inset-0 rounded-full bg-slate-800 border border-slate-700"></div>
            {/* Light part (right side) */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-100 dark:bg-yellow-300 rounded-r-full"></div>
            </div>
            {/* Dark overlay creating crescent shape */}
            <div
              className="absolute inset-0 rounded-full bg-slate-800 shadow-[inset_-3px_0_0_0_rgba(0,0,0,0.2)]"
              style={{ clipPath: "ellipse(50% 50% at 25% 50%)" }}
            ></div>
          </div>
        )

      case "first-quarter":
        return (
          <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
            {/* Half dark, half light */}
            <div className="absolute inset-0 bg-slate-800"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-100 dark:bg-yellow-300"></div>
          </div>
        )

      case "waxing-gibbous":
        return (
          <div className="relative w-full h-full">
            {/* Light circle background */}
            <div className="absolute inset-0 rounded-full bg-yellow-100 dark:bg-yellow-300 border border-slate-300 dark:border-slate-700"></div>
            {/* Dark overlay creating gibbous shape */}
            <div
              className="absolute inset-0 rounded-full bg-slate-800 shadow-[inset_3px_0_0_0_rgba(0,0,0,0.2)]"
              style={{ clipPath: "ellipse(50% 50% at 75% 50%)" }}
            ></div>
          </div>
        )

      case "full-moon":
        return (
          <div className="relative w-full h-full rounded-full bg-yellow-100 dark:bg-yellow-300 border border-slate-300 dark:border-slate-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.1)]">
            {/* Full moon is completely light */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-yellow-200/30 dark:to-yellow-400/30"></div>
          </div>
        )

      case "waning-gibbous":
        return (
          <div className="relative w-full h-full">
            {/* Light circle background */}
            <div className="absolute inset-0 rounded-full bg-yellow-100 dark:bg-yellow-300 border border-slate-300 dark:border-slate-700"></div>
            {/* Dark overlay creating gibbous shape */}
            <div
              className="absolute inset-0 rounded-full bg-slate-800 shadow-[inset_-3px_0_0_0_rgba(0,0,0,0.2)]"
              style={{ clipPath: "ellipse(50% 50% at 25% 50%)" }}
            ></div>
          </div>
        )

      case "last-quarter":
        return (
          <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
            {/* Half dark, half light */}
            <div className="absolute inset-0 bg-slate-800"></div>
            <div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-100 dark:bg-yellow-300"></div>
          </div>
        )

      case "waning-crescent":
        return (
          <div className="relative w-full h-full">
            {/* Dark circle background */}
            <div className="absolute inset-0 rounded-full bg-slate-800 border border-slate-700"></div>
            {/* Light part (left side) */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-100 dark:bg-yellow-300 rounded-l-full"></div>
            </div>
            {/* Dark overlay creating crescent shape */}
            <div
              className="absolute inset-0 rounded-full bg-slate-800 shadow-[inset_3px_0_0_0_rgba(0,0,0,0.2)]"
              style={{ clipPath: "ellipse(50% 50% at 75% 50%)" }}
            ></div>
          </div>
        )

      default:
        return (
          <div className="relative w-full h-full rounded-full bg-slate-400 border border-slate-300 dark:border-slate-700">
            {/* Fallback */}
          </div>
        )
    }
  }

  return <div className={cn("relative", sizeClasses[size], className)}>{renderMoonPhase()}</div>
}
