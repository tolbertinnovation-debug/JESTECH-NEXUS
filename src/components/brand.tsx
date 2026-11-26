import Link from "next/link";
import {
  BookOpen,
  Cpu,
  Database,
  FileText,
  Globe,
  Layers,
  Leaf,
  Lightbulb,
  PenTool,
  Shield,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "./logo-mark";
import { cx } from "./ui";

export function Logo({ label = "JesTech Nexus", className }: { label?: string; className?: string }) {
  return (
    <Link href="/" className={cx("inline-flex items-center gap-2 font-display font-bold", className)}>
      <LogoMark className="h-7 w-auto shrink-0" />
      <span className="text-lg">{label}</span>
    </Link>
  );
}

/** Course / module icons, keyed by the `icon` column. */
export const courseIcons: Record<string, LucideIcon> = {
  cpu: Cpu,
  layout: Layers,
  shield: Shield,
  data: Database,
  pen: PenTool,
  leaf: Leaf,
  sprout: Sprout,
  book: BookOpen,
  file: FileText,
  globe: Globe,
  users: Users,
  bulb: Lightbulb,
};

export function CourseIcon({ name, className }: { name: string; className?: string }) {
  const Icon = courseIcons[name] ?? BookOpen;
  return <Icon className={className} aria-hidden strokeWidth={1.75} />;
}

/**
 * Hero artwork from the blueprint: a constellation joining an orange sun,
 * layered hills and a young tree. Inline SVG — a few hundred bytes, no image request.
 */
export function HeroArt({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="A constellation of connected points leading to a rising orange sun over hills"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sun" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c45400" />
          <stop offset="0.55" stopColor="#ff6d00" />
          <stop offset="1" stopColor="#ff6d00" />
        </linearGradient>
        <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff6d00" />
          <stop offset="1" stopColor="#c45400" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="#0d0d0d" />
      <g fill="none" stroke="#ff6d00" strokeOpacity="0.35">
        <circle cx="300" cy="95" r="78" />
        <circle cx="300" cy="95" r="62" />
      </g>
      <circle cx="300" cy="95" r="46" fill="url(#sun)" />
      <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
        <polyline points="40,62 110,96 175,52 245,108 300,95" />
        <line x1="110" y1="96" x2="135" y2="148" />
        <line x1="135" y1="148" x2="245" y2="108" />
      </g>
      <g fill="#f2f2f2">
        <circle cx="40" cy="62" r="5" />
        <circle cx="110" cy="96" r="7" />
        <circle cx="175" cy="52" r="6" />
        <circle cx="135" cy="148" r="5" />
        <circle cx="245" cy="108" r="7" />
      </g>
      <path d="M0 200 C 80 170, 160 190, 240 178 S 360 160, 400 172 V300 H0Z" fill="#222" />
      <path d="M0 226 C 90 205, 190 232, 280 214 S 370 204, 400 210 V300 H0Z" fill="#333" />
      {!compact && (
        <path d="M0 262 C 100 238, 220 262, 320 246 S 390 240, 400 244 V300 H0Z" fill="url(#ground)" />
      )}
      <g stroke="#e6e6e6" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M352 250 C 352 225, 350 210, 356 190" />
        <path d="M354 214 C 340 206, 334 196, 334 184" />
        <path d="M355 206 C 368 200, 374 190, 374 178" />
      </g>
    </svg>
  );
}
