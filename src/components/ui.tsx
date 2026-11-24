import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------- Buttons */

type Variant = "primary" | "secondary" | "dark" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-ink hover:bg-brand-dark border border-brand hover:border-brand-dark",
  secondary: "bg-paper text-ink border border-ink hover:bg-mist",
  dark: "bg-ink text-paper border border-ink hover:bg-ink-muted",
  ghost: "bg-transparent text-ink hover:bg-mist border border-transparent",
  inverse: "bg-transparent text-paper border border-paper hover:bg-paper/10",
};
const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold transition-colors",
    "disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    extra,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/* ------------------------------------------------------ Chips & badges */

export function Chip({
  active,
  href,
  children,
}: {
  active?: boolean;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cx(
        "inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-colors",
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink",
      )}
    >
      {children}
    </Link>
  );
}

type Tone = "brand" | "tint" | "dark" | "muted" | "outline";
const tones: Record<Tone, string> = {
  brand: "bg-brand text-ink",
  tint: "bg-brand-tint text-brand-ink",
  dark: "bg-ink text-paper",
  muted: "bg-mist text-ink-muted",
  outline: "border border-line text-ink-muted",
};

export function Badge({
  tone = "tint",
  children,
  className,
  title,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------- Containers */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("rounded-card border border-line bg-paper", className)} {...props} />;
}

export function PageHeader({
  title,
  intro,
  eyebrow,
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-ink text-paper">
      <div className="container-page py-10 sm:py-12">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-base text-paper/80">{intro}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className="h-2 w-full overflow-hidden rounded-full bg-mist"
    >
      <div className="h-full rounded-full bg-brand" style={{ width: `${v}%` }} />
    </div>
  );
}

export function IconTile({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-lg",
        dark ? "bg-paper text-ink" : "bg-brand text-ink",
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-mist/50 p-8 text-center">
      <p className="font-display font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-subtle">{children}</div>}
    </div>
  );
}

/* --------------------------------------------------------------- Forms */

const fieldBase =
  "w-full rounded-md border border-line bg-paper px-3 text-base text-ink placeholder:text-subtle/70 focus:border-ink focus:outline-none focus-visible:outline-brand";

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-subtle">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cx(fieldBase, "min-h-11", props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea rows={4} {...props} className={cx(fieldBase, "py-2.5", props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cx(fieldBase, "min-h-11", props.className)} />;
}

/** Hidden field that bots fill in and humans never see. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
