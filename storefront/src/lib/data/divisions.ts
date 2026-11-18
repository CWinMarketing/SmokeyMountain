import { listCategories } from "./categories"
import { HttpTypes } from "@medusajs/types"
import { Division } from "@modules/divisions/theme-config"

export async function getDivisionCategories(division: Division): Promise<{
  top: HttpTypes.StoreProductCategory | undefined
  subcategories: HttpTypes.StoreProductCategory[]
}> {
  const categories = await listCategories()

  const divisionCategories = (categories || []).filter(
    (c: any) => c.metadata?.division === division
  )

  const top = divisionCategories.find((c) => !c.parent_category_id)
  const subcategories = divisionCategories.filter((c) => c.parent_category_id)

  return { top, subcategories }
}
