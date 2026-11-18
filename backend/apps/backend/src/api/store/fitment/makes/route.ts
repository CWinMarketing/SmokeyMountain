import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/makes?year=2018 -> distinct makes for that year.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const year = req.query.year ? Number(req.query.year) : undefined

  const vehicles = await fitmentModuleService.listVehicles(
    year ? { year } : {},
    { select: ["make"] }
  )

  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort()

  res.json({ makes })
}
