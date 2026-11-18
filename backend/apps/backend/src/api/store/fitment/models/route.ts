import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/models?year=2018&make=Ford -> distinct models.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const year = req.query.year ? Number(req.query.year) : undefined
  const make = req.query.make ? String(req.query.make) : undefined

  const filters: Record<string, unknown> = {}
  if (year) filters.year = year
  if (make) filters.make = make

  const vehicles = await fitmentModuleService.listVehicles(filters, {
    select: ["model"],
  })

  const models = Array.from(new Set(vehicles.map((v) => v.model))).sort()

  res.json({ models })
}
