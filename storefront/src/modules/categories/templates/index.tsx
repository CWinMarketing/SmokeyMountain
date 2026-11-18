import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import DivisionThemeProvider from "@modules/divisions/components/division-theme-provider"
import { isDivision } from "@modules/divisions/theme-config"
import { getSelectedVehicle } from "@lib/data/fitment-cookie"
import { getProductsForVehicle } from "@modules/fitment/lib/fitment-client"
import VehicleSelector from "@modules/fitment/components/vehicle-selector"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const division = (category.metadata as any)?.division
  const isRacing = isDivision(division) && division === "racing"

  let fitmentProductIds: string[] | undefined
  let selectedVehicle: { id: string; label: string } | null = null

  if (isRacing) {
    selectedVehicle = await getSelectedVehicle()
    if (selectedVehicle) {
      const { fits, universal } = await getProductsForVehicle(
        selectedVehicle.id
      )
      const combined = [...fits, ...universal]
      // Guard against an empty result being treated as "no id filter" by
      // the products endpoint - force a zero-result match instead of
      // silently falling back to showing everything in the category.
      fitmentProductIds = combined.length > 0 ? combined : ["__no_fitment_match__"]
    }
  }

  const content = (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {isRacing && (
          <div className="mb-8">
            <VehicleSelector
              initialLabel={selectedVehicle?.label ?? null}
              syncToUrl
            />
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            productsIds={fitmentProductIds}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )

  if (isDivision(division)) {
    return <DivisionThemeProvider division={division}>{content}</DivisionThemeProvider>
  }

  return content
}
