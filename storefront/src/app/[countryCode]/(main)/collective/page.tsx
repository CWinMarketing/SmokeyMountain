import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DivisionThemeProvider from "@modules/divisions/components/division-theme-provider"
import { DIVISION_THEMES } from "@modules/divisions/theme-config"
import { getDivisionCategories } from "@lib/data/divisions"

export const metadata: Metadata = {
  title: "Win-R Collective | Win-R Automotive",
  description: "Bespoke, automotive-inspired apparel.",
}

export default async function CollectivePage() {
  const theme = DIVISION_THEMES.collective
  const { subcategories } = await getDivisionCategories("collective")

  return (
    <DivisionThemeProvider division="collective">
      <section
        className="px-6 py-20 text-center"
        style={{ backgroundColor: "var(--division-surface)" }}
      >
        <h1 className="text-4xl font-bold small:text-5xl">{theme.label}</h1>
        <p className="mt-3 text-ui-fg-subtle">{theme.tagline}</p>
      </section>
      <div className="content-container grid grid-cols-2 gap-4 py-8 small:grid-cols-4">
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
