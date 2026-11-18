import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../modules/fitment"
import type FitmentModuleService from "../../../modules/fitment/service"

// Minimal admin CRUD for the fitment module - list/create only, for
// demo/debugging use. Not a full admin UI (out of scope for Milestone 1).
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const [vehicles, count] = await fitmentModuleService.listAndCountVehicles(
    {},
    { take: 100 }
  )

  res.json({ vehicles, count })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const vehicle = await fitmentModuleService.createVehicles(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ vehicle })
}
