"use client"

import { useEffect, useState } from "react"
import { checkFit } from "../lib/fitment-client"
import VehicleSelector from "./vehicle-selector"

type Props = {
  productId: string
  initialVehicle: { id: string; label: string } | null
}

type FitResult = {
  fits: boolean
  universal: boolean
  notes: string | null
} | null

export default function FitConfirmationBanner({
  productId,
  initialVehicle,
}: Props) {
  const [result, setResult] = useState<FitResult>(null)
  const [loading, setLoading] = useState(Boolean(initialVehicle))

  useEffect(() => {
    if (!initialVehicle) {
      setResult(null)
      return
    }
    setLoading(true)
    checkFit(productId, initialVehicle.id)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false))
  }, [productId, initialVehicle?.id])

  if (!initialVehicle) {
    return (
      <div className="mb-4">
        <VehicleSelector initialLabel={null} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mb-4 rounded-md border border-ui-border-base bg-ui-bg-subtle px-4 py-3 text-sm text-ui-fg-subtle">
        Checking fit for {initialVehicle.label}...
      </div>
    )
  }

  if (!result) {
    return null
  }

  if (result.universal) {
    return (
      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Universal fit - verify compatibility with your {initialVehicle.label}.
      </div>
    )
  }

  if (result.fits) {
    return (
      <div className="mb-4 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Fits your {initialVehicle.label}
        {result.notes ? ` - ${result.notes}` : ""}
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      Does not fit your {initialVehicle.label}.
      <div className="mt-2">
        <VehicleSelector initialLabel={null} />
      </div>
    </div>
  )
}
