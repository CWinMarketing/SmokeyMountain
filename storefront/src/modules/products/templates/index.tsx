import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import DivisionThemeProvider from "@modules/divisions/components/division-theme-provider"
import { isDivision } from "@modules/divisions/theme-config"
import { getSelectedVehicle } from "@lib/data/fitment-cookie"
import FitConfirmationBanner from "@modules/fitment/components/fit-confirmation-banner"
import SpecSheet from "@modules/products/components/spec-sheet"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

async function ProductTemplate({
  product,
  region,
  countryCode,
  images,
}: ProductTemplateProps) {
  if (!product || !product.id) {
    return notFound()
  }

  const division = product.categories
    ?.map((c: any) => c.metadata?.division)
    .find((d: unknown) => isDivision(d))

  const selectedVehicle = isDivision(division) && division === "racing"
    ? await getSelectedVehicle()
    : null

  const content = (
    <>
      <div
        className="content-container  flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={images} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          {isDivision(division) && division === "racing" && (
            <FitConfirmationBanner
              productId={product.id}
              initialVehicle={selectedVehicle}
            />
          )}
          {isDivision(division) && division === "sim" && (
            <SpecSheet metadata={product.metadata} />
          )}
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )

  if (isDivision(division)) {
    return <DivisionThemeProvider division={division}>{content}</DivisionThemeProvider>
  }

  return content
}

export default ProductTemplate
