// Isomorphic fetch helpers for the custom /store/fitment/* routes. These are
// plain REST calls (not part of the Medusa JS SDK's typed surface), so they
// use NEXT_PUBLIC_* env vars directly rather than the server-only `sdk`
// client in lib/config.ts - that lets the same functions run from a client
// component (the cascading vehicle selector) and a server component (the
// Racing PLP's fitment filtering) without duplicating the logic.

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

async function fitmentFetch<T>(
  path: string,
  params: Record<string, string | undefined> = {}
): Promise<T> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, value)
  })
  const qs = query.toString()
  const url = `${BACKEND_URL}/store/fitment/${path}${qs ? `?${qs}` : ""}`

  const res = await fetch(url, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Fitment request failed: ${path} (${res.status})`)
  }

  return res.json()
}

export type FitmentVehicle = {
  id: string
  year: number
  make: string
  model: string
  submodel: string | null
  engine: string | null
}

export type FitmentEngineOption = {
  vehicle_id: string
  engine: string | null
  submodel: string | null
}

export async function getYears(): Promise<number[]> {
  const { years } = await fitmentFetch<{ years: number[] }>("years")
  return years
}

export async function getMakes(year: number): Promise<string[]> {
  const { makes } = await fitmentFetch<{ makes: string[] }>("makes", {
    year: String(year),
  })
  return makes
}

export async function getModels(year: number, make: string): Promise<string[]> {
  const { models } = await fitmentFetch<{ models: string[] }>("models", {
    year: String(year),
    make,
  })
  return models
}

export async function getEngines(
  year: number,
  make: string,
  model: string
): Promise<FitmentEngineOption[]> {
  const { engines } = await fitmentFetch<{ engines: FitmentEngineOption[] }>(
    "engines",
    { year: String(year), make, model }
  )
  return engines
}

export async function getProductsForVehicle(
  vehicleId: string
): Promise<{ fits: string[]; universal: string[] }> {
  const data = await fitmentFetch<{
    fits: { product_id: string }[]
    universal: { product_id: string }[]
  }>("products", { vehicle_id: vehicleId })
  return {
    fits: data.fits.map((f) => f.product_id),
    universal: data.universal.map((f) => f.product_id),
  }
}

export async function checkFit(
  productId: string,
  vehicleId: string
): Promise<{ fits: boolean; universal: boolean; notes: string | null }> {
  return fitmentFetch("check", {
    product_id: productId,
    vehicle_id: vehicleId,
  })
}
