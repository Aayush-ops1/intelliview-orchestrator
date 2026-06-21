"use client";
import { cn } from "@/lib/utils";

export function IllustrationEmpty({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn("h-32 w-48 text-muted", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="30" y="20" width="140" height="100" rx="8" strokeOpacity="0.4" />
      <line x1="50" y1="50" x2="150" y2="50" strokeOpacity="0.3" />
      <line x1="50" y1="70" x2="130" y2="70" strokeOpacity="0.3" />
      <line x1="50" y1="90" x2="120" y2="90" strokeOpacity="0.3" />
      <circle cx="100" cy="105" r="14" strokeOpacity="0.5" />
      <path d="M 94 105 L 100 99 L 106 105 L 100 111 Z" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

export function IllustrationWorkers({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn("h-32 w-48 text-muted", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="20" y="40" width="40" height="50" rx="4" strokeOpacity="0.4" />
      <rect x="80" y="30" width="40" height="60" rx="4" strokeOpacity="0.5" />
      <rect x="140" y="50" width="40" height="40" rx="4" strokeOpacity="0.4" />
      <circle cx="40" cy="32" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="100" cy="22" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="160" cy="42" r="3" fill="currentColor" opacity="0.6" />
      <line x1="43" y1="35" x2="97" y2="25" strokeOpacity="0.2" />
      <line x1="103" y1="25" x2="157" y2="45" strokeOpacity="0.2" />
    </svg>
  );
}

export function IllustrationError({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn("h-32 w-48 text-rose-400/70", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="100" cy="70" r="40" strokeOpacity="0.4" />
      <line x1="100" y1="50" x2="100" y2="80" strokeOpacity="0.7" />
      <circle cx="100" cy="92" r="2" fill="currentColor" />
    </svg>
  );
}
