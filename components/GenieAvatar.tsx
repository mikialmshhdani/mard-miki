import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function GenieAvatar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer ambient glow */}
      <div
        className={`absolute -inset-2 rounded-full bg-cyan-500/30 blur-xl transition-all duration-500 ${
          isHovered ? "opacity-80 scale-110" : "opacity-40"
        }`}
      />

      {/* Animated pulse ring */}
      <div className="absolute -inset-1 rounded-full">
        <div
          className={`absolute inset-0 rounded-full border-2 border-cyan-400/60 transition-all duration-300 ${
            isHovered ? "animate-ping opacity-30" : "opacity-0"
          }`}
          style={{ animationDuration: "1.5s" }}
        />
      </div>

      {/* Rotating glow ring */}
      <div
        className={`absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-75 blur-sm transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-50"
        }`}
        style={{ animation: "spin 3s linear infinite" }}
      />

      {/* Avatar container */}
      <Avatar
        className={`relative w-12 h-12 border-2 transition-all duration-300 ${
          isHovered
            ? "border-cyan-300 shadow-lg shadow-cyan-500/50 scale-105"
            : "border-cyan-500/70"
        }`}
      >
        <AvatarFallback className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-0 overflow-hidden">
          {/* 3D Genie Mascot SVG */}
          <svg viewBox="0 0 56 56" className="w-full h-full" fill="none">
            <circle cx="28" cy="28" r="26" fill="url(#bgGradient)" />
            <ellipse cx="28" cy="30" rx="14" ry="16" fill="url(#genieBody)" />
            <ellipse cx="24" cy="26" rx="6" ry="8" fill="url(#bodyHighlight)" opacity="0.4" />
            <ellipse cx="28" cy="14" rx="5" ry="4" fill="url(#genieBody)" />
            <circle cx="28" cy="12" r="2.5" fill="#22d3ee" opacity="0.8" />
            <ellipse cx="22" cy="28" rx="4" ry="5" fill="#0f172a" />
            <ellipse cx="22" cy="28" rx="3" ry="4" fill="#1e293b" />
            <circle cx="22" cy="27" r="2" fill="#22d3ee" className="animate-pulse" />
            <circle cx="21" cy="26" r="0.8" fill="white" opacity="0.8" />
            <ellipse cx="34" cy="28" rx="4" ry="5" fill="#0f172a" />
            <ellipse cx="34" cy="28" rx="3" ry="4" fill="#1e293b" />
            <circle cx="34" cy="27" r="2" fill="#22d3ee" className="animate-pulse" />
            <circle cx="33" cy="26" r="0.8" fill="white" opacity="0.8" />
            <path d="M22 36 Q28 42 34 36" stroke="url(#smileGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M12 38 Q8 44 12 50 Q16 54 20 50" stroke="url(#wispGradient)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M44 38 Q48 44 44 50 Q40 54 36 50" stroke="url(#wispGradient)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
            <circle cx="16" cy="20" r="1" fill="#22d3ee" opacity="0.6" className="animate-pulse" />
            <circle cx="40" cy="22" r="0.8" fill="#60a5fa" opacity="0.5" className="animate-pulse" />
            <defs>
              <radialGradient id="bgGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
              <linearGradient id="genieBody" x1="14" y1="14" x2="42" y2="46">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="50%" stopColor="#0e7490" />
                <stop offset="100%" stopColor="#164e63" />
              </linearGradient>
              <linearGradient id="bodyHighlight" x1="18" y1="18" x2="30" y2="34">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="smileGradient" x1="22" y1="36" x2="34" y2="42">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="wispGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </AvatarFallback>
      </Avatar>

      {/* Corner glow accents */}
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full transition-all duration-300 ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      />
      <div
        className={`absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
        style={{ transitionDelay: "50ms" }}
      />
    </div>
  );
}