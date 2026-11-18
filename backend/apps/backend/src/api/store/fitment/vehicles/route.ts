import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FITMENT_MODULE } from "../../../../modules/fitment"
import type FitmentModuleService from "../../../../modules/fitment/service"

// GET /store/fitment/vehicles?year=&make=&model=&engine=&submodel=
// Generic vehicle resolver, used when a page loads directly from a shared
// URL (e.g. a bookmarked Racing PLP link) and needs to resolve the exact
// vehicle row(s) matching the query params, without walking the cascade.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentModuleService: FitmentModuleService = req.scope.resolve(
    FITMENT_MODULE
  )

  const { year, make, model, engine, submodel } = req.query
  const filters: Record<string, unknown> = {}
  if (year) filters.year = Number(year)
  if (make) filters.make = String(make)
  if (model) filters.model = String(model)
  if (engine) filters.engine = String(engine)
  if (submodel) filters.submodel = String(submodel)

  const vehicles = await fitmentModuleService.listVehicles(filters)

  res.json({ vehicles })
}
