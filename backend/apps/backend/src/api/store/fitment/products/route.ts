import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/products?vehicle_id=veh_xxx
// Returns product ids fitted to the given vehicle plus universal-fit
// products. Never duplicates product content - the storefront fetches
// full product data from the core Store Product API using these ids, so
// there's one source of truth for product content.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const vehicleId = req.query.vehicle_id
    ? String(req.query.vehicle_id)
    : undefined

  if (!vehicleId) {
    res.status(400).json({ message: "vehicle_id query param is required" })
    return
  }

  const [fitted, universal] = await Promise.all([
    fitmentModuleService.listProductFitments({
      vehicle_id: vehicleId,
      is_universal: false,
    }),
    fitmentModuleService.listProductFitments({ is_universal: true }),
  ])

  res.json({
    fits: fitted.map((f) => ({ product_id: f.product_id, notes: f.notes })),
    universal: universal.map((f) => ({
      product_id: f.product_id,
      notes: f.notes,
    })),
  })
}
