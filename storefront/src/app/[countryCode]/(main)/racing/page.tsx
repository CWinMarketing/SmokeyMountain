import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DivisionThemeProvider from "@modules/divisions/components/division-theme-provider"
import { DIVISION_THEMES } from "@modules/divisions/theme-config"
import { getDivisionCategories } from "@lib/data/divisions"
import { getSelectedVehicle } from "@lib/data/fitment-cookie"
import VehicleSelector from "@modules/fitment/components/vehicle-selector"

export const metadata: Metadata = {
  title: "Win-R Racing | Win-R Automotive",
  description: "Automotive aftermarket performance parts.",
}

export default async function RacingPage() {
  const theme = DIVISION_THEMES.racing
  const { subcategories } = await getDivisionCategories("racing")
  const vehicle = await getSelectedVehicle()

  return (
    <DivisionThemeProvider division="racing">
      <section
        className="px-6 py-20 text-center text-white"
        style={{ backgroundColor: "var(--division-surface)" }}
      >
        <h1 className="text-4xl font-bold small:text-5xl">{theme.label}</h1>
        <p className="mt-3 text-gray-300">{theme.tagline}</p>
      </section>
      <div className="content-container py-8">
        <VehicleSelector initialLabel={vehicle?.label ?? null} />
      </div>
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
