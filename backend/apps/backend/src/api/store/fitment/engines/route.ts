import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/engines?year=2018&make=Ford&model=Mustang
// Returns the final cascading step: one entry per distinct engine/submodel
// combination, each carrying the exact vehicle_id the selector should
// resolve to (two vehicles can share year/make/model but differ by
// submodel/engine, so this is the step that disambiguates them).
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const year = req.query.year ? Number(req.query.year) : undefined
  const make = req.query.make ? String(req.query.make) : undefined
  const model = req.query.model ? String(req.query.model) : undefined

  const filters: Record<string, unknown> = {}
  if (year) filters.year = year
  if (make) filters.make = make
  if (model) filters.model = model

  const vehicles = await fitmentModuleService.listVehicles(filters, {
    select: ["id", "engine", "submodel"],
  })

  const engines = vehicles.map((v) => ({
    vehicle_id: v.id,
    engine: v.engine,
    submodel: v.submodel,
  }))

  res.json({ engines })
}
