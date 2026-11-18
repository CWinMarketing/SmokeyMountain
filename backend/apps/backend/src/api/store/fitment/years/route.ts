import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/years -> distinct vehicle years, newest first.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const vehicles = await fitmentModuleService.listVehicles(
    {},
    { select: ["year"] }
  )

  const years = Array.from(new Set(vehicles.map((v) => v.year))).sort(
    (a, b) => b - a
  )

  res.json({ years })
}
