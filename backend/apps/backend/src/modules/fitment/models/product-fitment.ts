import { model } from "@medusajs/framework/utils"

// Links a core Medusa Product (by id) to a Vehicle in this module.
// product_id is stored as plain text rather than a formal Medusa module
// link: Product lives in the core Product module, Vehicle lives here, and
// keeping the join local to this module avoids relying on defineLink's
// extra-columns support (a known rough edge in Medusa v2 at time of writing).
const ProductFitment = model.define("product_fitment", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  vehicle_id: model.text().nullable(),
  is_universal: model.boolean().default(false),
  notes: model.text().nullable(),
})

export default ProductFitment
