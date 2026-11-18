import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DivisionThemeProvider from "@modules/divisions/components/division-theme-provider"
import { DIVISION_THEMES } from "@modules/divisions/theme-config"
import { getDivisionCategories } from "@lib/data/divisions"

export const metadata: Metadata = {
  title: "Win-R Sim | Win-R Automotive",
  description: "Pro-grade gear for sim racing.",
}

export default async function SimPage() {
  const theme = DIVISION_THEMES.sim
  const { subcategories } = await getDivisionCategories("sim")

  return (
    <DivisionThemeProvider division="sim">
      <section
        className="px-6 py-20 text-center text-white"
        style={{ backgroundColor: "var(--division-surface)" }}
      >
        <h1 className="text-4xl font-bold small:text-5xl">{theme.label}</h1>
        <p className="mt-3 text-gray-300">{theme.tagline}</p>
      </section>
      <div className="content-container grid grid-cols-2 gap-4 py-8 small:grid-cols-3">
        {subcategories.map((c) => (
          <LocalizedClientLink
            key={c.id}
            href={`/categories/${c.handle}`}
            className="rounded-md border border-ui-border-base p-6 text-center font-medium transition-colors hover:border-[var(--division-accent)] hover:text-[var(--division-accent)]"
          >
            {c.name}
          </LocalizedClientLink>
        ))}
      </div>
    </DivisionThemeProvider>
  )
}
