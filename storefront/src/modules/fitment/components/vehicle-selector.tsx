"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  getYears,
  getMakes,
  getModels,
  getEngines,
  FitmentEngineOption,
} from "../lib/fitment-client"
import { WR_VEHICLE_COOKIE } from "../lib/constants"

type Props = {
  // Current selection label (e.g. "2018 Ford Mustang GT 5.0L V8"), rendered
  // server-side from the wr_vehicle cookie so there's no selected-vehicle
  // flash on first paint.
  initialLabel?: string | null
  // When true (Racing PLP pages), also mirror the resolved vehicle into the
  // URL's query params so a filtered listing is linkable/shareable.
  syncToUrl?: boolean
}

function setVehicleCookie(id: string, label: string) {
  const value = encodeURIComponent(JSON.stringify({ id, label }))
  document.cookie = `${WR_VEHICLE_COOKIE}=${value}; path=/; max-age=31536000`
}

function clearVehicleCookie() {
  document.cookie = `${WR_VEHICLE_COOKIE}=; path=/; max-age=0`
}

export default function VehicleSelector({
  initialLabel,
  syncToUrl = false,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(!initialLabel)
  const [years, setYears] = useState<number[]>([])
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [engines, setEngines] = useState<FitmentEngineOption[]>([])

  const [year, setYear] = useState<string>("")
  const [make, setMake] = useState<string>("")
  const [model, setModel] = useState<string>("")
  const [engine, setEngine] = useState<string>("")

  useEffect(() => {
    if (open) getYears().then(setYears).catch(() => setYears([]))
  }, [open])

  useEffect(() => {
    setMake("")
    setModels([])
    setModel("")
    setEngines([])
    setEngine("")
    if (year) getMakes(Number(year)).then(setMakes).catch(() => setMakes([]))
  }, [year])

  useEffect(() => {
    setModel("")
    setEngines([])
    setEngine("")
    if (year && make)
      getModels(Number(year), make).then(setModels).catch(() => setModels([]))
  }, [year, make])

  useEffect(() => {
    setEngine("")
    if (year && make && model)
      getEngines(Number(year), make, model)
        .then(setEngines)
        .catch(() => setEngines([]))
  }, [year, make, model])

  const selectedEngineOption = engines.find((e) => e.vehicle_id === engine)

  const handleConfirm = () => {
    if (!selectedEngineOption) return
    const label = [
      year,
      make,
      model,
      selectedEngineOption.submodel,
      selectedEngineOption.engine,
    ]
      .filter(Boolean)
      .join(" ")
    setVehicleCookie(selectedEngineOption.vehicle_id, label)
    setOpen(false)

    if (syncToUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("vehicle_id", selectedEngineOption.vehicle_id)
      router.push(`${pathname}?${params.toString()}`)
    }
    router.refresh()
  }

  const handleClear = () => {
    clearVehicleCookie()
    setYear("")
    setMake("")
    setModel("")
    setEngine("")
    setOpen(true)
    if (syncToUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("vehicle_id")
      router.push(`${pathname}?${params.toString()}`)
    }
    router.refresh()
  }

  if (!open && initialLabel) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-ui-border-base bg-ui-bg-subtle px-4 py-3 text-sm">
        <span className="text-ui-fg-subtle">Fits:</span>
        <span className="font-medium">{initialLabel}</span>
        <button
          className="ml-auto text-ui-fg-interactive underline"
          onClick={() => setOpen(true)}
        >
          Change vehicle
        </button>
        <button className="text-ui-fg-subtle underline" onClick={handleClear}>
          Clear
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-ui-border-base bg-ui-bg-subtle p-4">
      <p className="mb-3 text-sm font-medium">
        Select your vehicle to find parts that fit
      </p>
      <div className="grid grid-cols-2 gap-3 small:grid-cols-4">
        <select
          className="rounded-md border border-ui-border-base px-2 py-2 text-sm"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-ui-border-base px-2 py-2 text-sm"
          value={make}
          disabled={!year}
          onChange={(e) => setMake(e.target.value)}
        >
          <option value="">Make</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-ui-border-base px-2 py-2 text-sm"
          value={model}
          disabled={!make}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">Model</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-ui-border-base px-2 py-2 text-sm"
          value={engine}
          disabled={!model}
          onChange={(e) => setEngine(e.target.value)}
        >
          <option value="">Engine</option>
          {engines.map((e) => (
            <option key={e.vehicle_id} value={e.vehicle_id}>
              {[e.submodel, e.engine].filter(Boolean).join(" ") || "Standard"}
            </option>
          ))}
        </select>
      </div>
      <button
        className="mt-3 rounded-md bg-ui-button-inverted px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        disabled={!selectedEngineOption}
        onClick={handleConfirm}
      >
        Find Parts
      </button>
    </div>
  )
}
