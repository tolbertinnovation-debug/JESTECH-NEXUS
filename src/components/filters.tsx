import { Search } from "lucide-react";
import { Chip } from "./ui";

export type Params = Record<string, string | undefined>;

/** Normalise Next's searchParams into a flat string record. */
export function flatParams(sp: Record<string, string | string[] | undefined>): Params {
  return Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}

export function hrefWith(base: string, current: Params, key: string, value?: string) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) if (v && k !== key) next.set(k, v);
  if (value) next.set(key, value);
  const qs = next.toString();
  return qs ? `${base}?${qs}` : base;
}

export function FilterGroup({
  label,
  name,
  options,
  base,
  current,
}: {
  label: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  base: string;
  current: Params;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        <Chip href={hrefWith(base, current, name)} active={!current[name]}>
          All
        </Chip>
        {options.map((o) => (
          <Chip key={o.value} href={hrefWith(base, current, name, o.value)} active={current[name] === o.value}>
            {o.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

/** Plain GET form: works without JavaScript and keeps other filters. */
export function SearchBox({
  action,
  current,
  placeholder,
  dark,
}: {
  action: string;
  current: Params;
  placeholder: string;
  dark?: boolean;
}) {
  return (
    <form action={action} method="get" role="search" className="relative w-full">
      {Object.entries(current).map(([k, v]) => (k !== "q" && v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label htmlFor={`search-${action}`} className="sr-only">
        {placeholder}
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" aria-hidden />
      <input
        id={`search-${action}`}
        type="search"
        name="q"
        defaultValue={current.q}
        placeholder={placeholder}
        className={
          "min-h-11 w-full rounded-md border pr-3 pl-9 text-base focus:outline-none " +
          (dark ? "border-paper/20 bg-paper text-ink" : "border-line bg-paper focus:border-ink")
        }
      />
    </form>
  );
}
