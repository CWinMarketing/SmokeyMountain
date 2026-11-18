import "server-only"
import { cookies as nextCookies } from "next/headers"
import { WR_VEHICLE_COOKIE } from "@modules/fitment/lib/constants"

export type SelectedVehicle = {
  id: string
  label: string
}

// Server-side read of the "my garage" vehicle selection, written client-side
// by the vehicle selector (see components/vehicle-selector.tsx). Used by
// server components - the Racing PLP (fitment filtering) and the PDP fit
// banner's initial render - so the selection persists across navigations
// without needing a client round-trip first.
export const getSelectedVehicle = async (): Promise<SelectedVehicle | null> => {
  try {
    const cookies = await nextCookies()
    const raw = cookies.get(WR_VEHICLE_COOKIE)?.value
    if (!raw) return null
    return JSON.parse(decodeURIComponent(raw))
  } catch {
    return null
  }
}
