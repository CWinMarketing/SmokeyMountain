import { Division, DIVISION_THEMES } from "../theme-config"

type Props = {
  division: Division
  children: React.ReactNode
  className?: string
}

// Sets CSS custom properties scoped to this subtree. Components reference
// them via Tailwind arbitrary values (`bg-[var(--division-accent)]`), so a
// division's visual skin is just a set of variable overrides - no duplicated
// layout, nav, or component code per division.
export default function DivisionThemeProvider({
  division,
  children,
  className,
}: Props) {
  const theme = DIVISION_THEMES[division]

  return (
    <div
      className={className}
      style={
        {
          "--division-accent": theme.accent,
          "--division-accent-foreground": theme.accentForeground,
          "--division-surface": theme.surface,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
