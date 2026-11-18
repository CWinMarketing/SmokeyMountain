export type Division = "racing" | "collective" | "sim"

export type DivisionTheme = {
  label: string
  tagline: string
  accent: string
  accentForeground: string
  surface: string
}

// CSS custom property values per division, consumed via Tailwind arbitrary
// values (e.g. `bg-[var(--division-accent)]`). One layout/component set,
// three visual skins - see components/division-theme-provider.tsx.
export const DIVISION_THEMES: Record<Division, DivisionTheme> = {
  racing: {
    label: "Win-R Racing",
    tagline: "Performance parts, engineered for the track and the street.",
    accent: "#d7263d",
    accentForeground: "#ffffff",
    surface: "#111318",
  },
  collective: {
    label: "Win-R Collective",
    tagline: "Bespoke, automotive-inspired apparel.",
    accent: "#2b2b2b",
    accentForeground: "#ffffff",
    surface: "#f5f3ef",
  },
  sim: {
    label: "Win-R Sim",
    tagline: "Pro-grade gear for sim racing.",
    accent: "#2ec4ff",
    accentForeground: "#0a0a0a",
    surface: "#0b1220",
  },
}

export function isDivision(value: unknown): value is Division {
  return value === "racing" || value === "collective" || value === "sim"
}
