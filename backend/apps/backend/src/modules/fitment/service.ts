import { MedusaService } from "@medusajs/framework/utils"
import Vehicle from "./models/vehicle"
import ProductFitment from "./models/product-fitment"

class FitmentModuleService extends MedusaService({
  Vehicle,
  ProductFitment,
}) {}

export default FitmentModuleService
