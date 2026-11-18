import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { DIVISION_THEMES } from "@modules/divisions/theme-config"

export const metadata: Metadata = {
  title: "Win-R Automotive",
  description:
    "Win-R Automotive - performance parts, bespoke apparel, and sim racing gear.",
}

const TILES = [
  { division: "racing" as const, href: "/racing" },
  { division: "collective" as const, href: "/collective" },
  { division: "sim" as const, href: "/sim" },
]

export default function Home() {
  return (
    <>
      <section className="bg-black px-6 py-24 text-center text-white">
        <h1 className="text-4xl font-bold small:text-6xl">WIN-R AUTOMOTIVE</h1>
        <p className="mt-4 text-lg text-gray-300">
          Performance. Style. Precision - on the road, off the track, and in
          the sim rig.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-px bg-ui-border-base small:grid-cols-3">
        {TILES.map(({ division, href }) => {
          const theme = DIVISION_THEMES[division]
          return (
            <LocalizedClientLink
              key={division}
              href={href}
              className="group relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: theme.surface }}
            >
              <h2
                className="text-3xl font-bold"
                style={{ color: theme.accentForeground }}
              >
                {theme.label}
              </h2>
              <p
                className="mt-3 max-w-xs text-sm"
                style={{ color: theme.accentForeground, opacity: 0.8 }}
              >
                {theme.tagline}
              </p>
              <span
                className="mt-6 rounded-full px-5 py-2 text-sm font-medium"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentForeground,
                }}
              >
                Shop {theme.label}
              </span>
            </LocalizedClientLink>
          )
        })}
      </section>
    </>
  )
}
