import { model } from "@medusajs/framework/utils"

// Denormalized on purpose: one row per year/make/model/submodel/engine
// combination, matching how a real ACES/VCdb feed would be queried
// (cascading year -> make -> model -> engine). See docs/fitment-data-model.md.
const Vehicle = model.define("vehicle", {
  id: model.id().primaryKey(),
  year: model.number(),
  make: model.text(),
  model: model.text(),
  submodel: model.text().nullable(),
  engine: model.text().nullable(),
  drive_type: model.text().nullable(),
})

export default Vehicle
