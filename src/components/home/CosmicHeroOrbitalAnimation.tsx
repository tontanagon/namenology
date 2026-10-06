"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Binary,
  ArrowRightLeft,
  Orbit,
  Compass,
} from "lucide-react";

interface TopicNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: {
    badgeBg: string;
    badgeBorder: string;
    text: string;
    dot: string;
    ray: string;
  };
  angle: number; // in degrees
}

const TOPICS: TopicNode[] = [
  {
    id: "cosmic-structure",
    stepNumber: "01",
    title: "Cosmic Structure",
    subtitle: "Milky Way Galaxy & Stars",
    description: "Existence and harmonic movement of celestial bodies across the Milky Way galaxy, forming the foundational energetic fabric.",
    icon: <Sparkles className="w-3.5 h-3.5 text-cyan-600" />,
    color: {
      badgeBg: "bg-white/95 hover:bg-cyan-50/80",
      badgeBorder: "border-cyan-200 hover:border-cyan-400",
      text: "text-cyan-900",
      dot: "bg-cyan-500 shadow-[0_0_6px_#06B6D4]",
      ray: "#06B6D4",
    },
    angle: 270, // Top
  },
  {
    id: "cosmic-code",
    stepNumber: "02",
    title: "Cosmic Code",
    subtitle: "Numbers 0–9 Energies",
    description: "Cosmic influences expressed through deterministic numerical vibrations 0–9, each carrying specific planetary characteristics.",
    icon: <Binary className="w-3.5 h-3.5 text-blue-600" />,
    color: {
      badgeBg: "bg-white/95 hover:bg-blue-50/80",
      badgeBorder: "border-blue-200 hover:border-blue-400",
      text: "text-blue-900",
      dot: "bg-blue-500 shadow-[0_0_6px_#3B82F6]",
      ray: "#3B82F6",
    },
    angle: 342, // Top-right
  },
  {
    id: "letter-conversion",
    stepNumber: "03",
    title: "Letter Conversion",
    subtitle: "Alphabet to Numbers 0–9",
    description: "Every official letter converts deterministically into mathematical numerical values 0–9 via Unicode acoustic matrix.",
    icon: <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />,
    color: {
      badgeBg: "bg-white/95 hover:bg-indigo-50/80",
      badgeBorder: "border-indigo-200 hover:border-indigo-400",
      text: "text-indigo-900",
      dot: "bg-indigo-500 shadow-[0_0_6px_#6366F1]",
      ray: "#6366F1",
    },
    angle: 54, // Bottom-right
  },
  {
    id: "name-analysis",
    stepNumber: "04",
    title: "Name Analysis",
    subtitle: "Harmonic Energy Synthesis",
    description: "Numbers from First Name and Surname combine and interpret through 40% / 20% / 40% harmonic life impact weighting.",
    icon: <Orbit className="w-3.5 h-3.5 text-purple-600" />,
    color: {
      badgeBg: "bg-white/95 hover:bg-purple-50/80",
      badgeBorder: "border-purple-200 hover:border-purple-400",
      text: "text-purple-900",
      dot: "bg-purple-500 shadow-[0_0_6px_#A855F7]",
      ray: "#A855F7",
    },
    angle: 126, // Bottom-left
  },
  {
    id: "life-path",
    stepNumber: "05",
    title: "Life Path",
    subtitle: "Destiny Resonance 1–100",
    description: "Final synthesized numerical matrix maps into 1–100 life vector, exploring Personality, Relationships, and Well-being.",
    icon: <Compass className="w-3.5 h-3.5 text-emerald-600" />,
    color: {
      badgeBg: "bg-white/95 hover:bg-emerald-50/80",
      badgeBorder: "border-emerald-200 hover:border-emerald-400",
      text: "text-emerald-900",
      dot: "bg-emerald-500 shadow-[0_0_6px_#10B981]",
      ray: "#10B981",
    },
    angle: 198, // Top-left
  },
];

export const CosmicHeroOrbitalAnimation: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<TopicNode | null>(null);

  // Orbital radii
  const rx = 185;
  const ry = 145;
  const cx = 250;
  const cy = 250;

  return (
    <div
      className="relative w-full max-w-[500px] xl:max-w-[540px] mx-auto select-none flex flex-col items-center justify-center"
      onMouseLeave={() => setActiveTopic(null)}
    >
      {/* Ethereal background pastel glow (frameless, seamless on white) */}
      <div className="absolute inset-10 bg-gradient-to-tr from-blue-400/[0.08] via-indigo-400/[0.08] to-purple-400/[0.06] rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* ── THE ORBITAL CANVAS (FRAMELESS, BORDERLESS) ── */}
      <div className="relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center overflow-visible">
        {/* SVG Layer: Orbital Tracks, Astrolabe Rings, Connecting Rays */}
        <svg
          viewBox="0 0 500 500"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
        >
          <defs>
            {/* Luminous Central Planet Gradient */}
            <radialGradient id="bright-celestial-planet" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#93C5FD" />
              <stop offset="70%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>

            {/* Planet Ring Gradient */}
            <linearGradient id="bright-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
            </linearGradient>

            {/* Core Star Radial Gradient */}
            <radialGradient id="bright-star-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Astrolabe Calibration Rings */}
          <circle cx="250" cy="250" r="235" stroke="#EEF2FF" strokeWidth="1" opacity="0.9" />
          <circle cx="250" cy="250" r="210" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.6" />

          {/* Primary Orbital Ellipse (Calibrated for bright canvas) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            stroke="#93C5FD"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.65"
          />

          {/* Secondary Resonance Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx - 38}
            ry={ry - 32}
            stroke="#C7D2FE"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.55"
          />

          {/* Axial Astrolabe Alignment Lines */}
          <line x1="250" y1="20" x2="250" y2="480" stroke="#93C5FD" strokeWidth="0.6" opacity="0.35" strokeDasharray="2 4" />
          <line x1="20" y1="250" x2="480" y2="250" stroke="#93C5FD" strokeWidth="0.6" opacity="0.35" strokeDasharray="2 4" />

          {/* Diagonal Rays */}
          <line x1="80" y1="80" x2="420" y2="420" stroke="#C4B5FD" strokeWidth="0.5" opacity="0.25" />
          <line x1="420" y1="80" x2="80" y2="420" stroke="#C4B5FD" strokeWidth="0.5" opacity="0.25" />

          {/* Connecting Resonance Rays from Center Planet to Each Node */}
          {TOPICS.map((topic) => {
            const rad = (topic.angle * Math.PI) / 180;
            const x = cx + rx * Math.cos(rad);
            const y = cy + ry * Math.sin(rad);
            const isActive = activeTopic?.id === topic.id;

            return (
              <g key={`ray-${topic.id}`}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke={topic.color.ray}
                  strokeWidth={isActive ? 1.8 : 0.9}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  opacity={isActive ? 0.8 : 0.3}
                  className="transition-all duration-300"
                />
                {/* Energy pulse bead along ray */}
                <circle
                  cx={cx + (x - cx) * 0.65}
                  cy={cy + (y - cy) * 0.65}
                  r={isActive ? 2.5 : 1.5}
                  fill={topic.color.ray}
                  opacity={isActive ? 0.9 : 0.5}
                />
              </g>
            );
          })}
        </svg>

        {/* ── ROTATING ORBITAL NODE CONTAINER ── */}
        {/* Continuous spinning orbit; does NOT stop on hover */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_42s_linear_infinite]"
          style={{ transformOrigin: "250px 250px" }}
        >
          {TOPICS.map((topic) => {
            const rad = (topic.angle * Math.PI) / 180;
            // Percentage position based on 500x500 box
            const leftPercent = ((cx + rx * Math.cos(rad)) / 500) * 100;
            const topPercent = ((cy + ry * Math.sin(rad)) / 500) * 100;
            const isActive = activeTopic?.id === topic.id;

            return (
              <div
                key={topic.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Counter-rotation container: keeps the badge upright continuously */}
                <div
                  className="animate-[spin_42s_linear_infinite_reverse]"
                  style={{ transformOrigin: "center center" }}
                >
                  <div
                    onMouseEnter={() => setActiveTopic(topic)}
                    className={`
                      group relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl
                      border transition-all duration-300 shadow-xs hover:shadow-md cursor-default select-none
                      ${topic.color.badgeBg} ${topic.color.badgeBorder}
                      ${isActive ? "scale-105 z-30 shadow-md ring-2 ring-blue-400/30" : "hover:scale-105 z-10"}
                    `}
                  >
                    {/* Node Glowing Core Dot */}
                    <span className={`w-2 h-2 rounded-full shrink-0 ${topic.color.dot}`} />

                    {/* Icon */}
                    <span className="shrink-0">{topic.icon}</span>

                    {/* Title */}
                    <span className={`text-[11px] sm:text-xs font-bold font-outfit whitespace-nowrap ${topic.color.text}`}>
                      {topic.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── THE CENTER: CELESTIAL PLANET CORE (NO HUMAN FIGURE) ── */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto group">
          {/* Pulsing Atmospheric Corona Glow */}
          <div className="absolute w-36 h-36 rounded-full bg-blue-500/10 blur-2xl animate-pulse pointer-events-none" />
          <div className="absolute w-28 h-28 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />

          {/* Central Planet Sphere Composite SVG */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
              {/* Outer Celestial Astrolabe Ring */}
              <circle
                cx="80"
                cy="80"
                r="74"
                stroke="#93C5FD"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0.6"
                className="animate-[spin_30s_linear_infinite]"
                style={{ transformOrigin: "80px 80px" }}
              />
              <circle cx="80" cy="80" r="66" stroke="#C7D2FE" strokeWidth="0.8" opacity="0.7" />

              {/* Planet Sphere Body with Radial Depth */}
              <circle
                cx="80"
                cy="80"
                r="48"
                fill="url(#bright-celestial-planet)"
                stroke="#0B5CFF"
                strokeWidth="1.2"
                filter="drop-shadow(0 4px 16px rgba(11, 92, 255, 0.25))"
              />

              {/* Spherical Latitude & Atmosphere Curves */}
              <path
                d="M 36 68 Q 80 82 124 68"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity="0.6"
                fill="none"
              />
              <path
                d="M 34 80 Q 80 96 126 80"
                stroke="#E0E7FF"
                strokeWidth="1.2"
                opacity="0.7"
                fill="none"
              />
              <path
                d="M 38 92 Q 80 106 122 92"
                stroke="#93C5FD"
                strokeWidth="1"
                opacity="0.5"
                fill="none"
              />

              {/* Central Luminous Energy Starburst */}
              <circle cx="80" cy="80" r="14" fill="#FFFFFF" opacity="0.9" filter="drop-shadow(0 0 6px rgba(255,255,255,0.8))" />
              <circle cx="80" cy="80" r="7" fill="#60A5FA" opacity="0.9" />
              <circle cx="80" cy="80" r="3" fill="#FFFFFF" />

              {/* Planetary Atmosphere Rings (Like Saturn / Celestial Axis) */}
              <ellipse
                cx="80"
                cy="80"
                rx="68"
                ry="20"
                stroke="url(#bright-ring-grad)"
                strokeWidth="2"
                opacity="0.85"
                transform="rotate(-24 80 80)"
              />
              <ellipse
                cx="80"
                cy="80"
                rx="62"
                ry="16"
                stroke="#93C5FD"
                strokeWidth="0.9"
                strokeDasharray="4 6"
                opacity="0.6"
                transform="rotate(-24 80 80)"
              />

              {/* Orbiting Satellite Nodes around Core */}
              <g className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: "80px 80px" }}>
                <circle cx="132" cy="80" r="3" fill="#0B5CFF" />
                <circle cx="28" cy="80" r="2.5" fill="#7C3AED" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
