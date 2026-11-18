import FitmentModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const FITMENT_MODULE = "fitment"

export default Module(FITMENT_MODULE, {
  service: FitmentModuleService,
})
