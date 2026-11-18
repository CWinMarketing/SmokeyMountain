import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/check?product_id=prod_xxx&vehicle_id=veh_xxx
// Used by the PDP fit-confirmation banner.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const productId = req.query.product_id
    ? String(req.query.product_id)
    : undefined
  const vehicleId = req.query.vehicle_id
    ? String(req.query.vehicle_id)
    : undefined

  if (!productId || !vehicleId) {
    res
      .status(400)
      .json({ message: "product_id and vehicle_id query params are required" })
    return
  }

  const fitments = await fitmentModuleService.listProductFitments({
    product_id: productId,
  })

  const universalMatch = fitments.find((f) => f.is_universal)
  if (universalMatch) {
    res.json({ fits: true, universal: true, notes: universalMatch.notes })
    return
  }

  const directMatch = fitments.find((f) => f.vehicle_id === vehicleId)
  if (directMatch) {
    res.json({ fits: true, universal: false, notes: directMatch.notes })
    return
  }

  res.json({ fits: false, universal: false, notes: null })
}
