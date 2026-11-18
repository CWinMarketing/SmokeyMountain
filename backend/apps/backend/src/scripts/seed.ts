import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"
import { FITMENT_MODULE } from "../modules/fitment"
import type FitmentModuleService from "../modules/fitment/service"

// Deterministic placeholder imagery - stable per-key so re-seeding produces
// the same images. Real product photography is out of scope for Milestone 1.
const img = (seed: string) => `https://picsum.photos/seed/${seed}/900/900`

// ---------------------------------------------------------------------------
// Vehicles (fitment data)
// ---------------------------------------------------------------------------

const VEHICLE_LINES: {
  make: string
  model: string
  years: number[]
  engines: string[]
}[] = [
  { make: "Ford", model: "Mustang", years: [2015, 2018, 2021], engines: ["5.0L V8", "2.3L I4 EcoBoost"] },
  { make: "Ford", model: "F-150", years: [2017, 2020], engines: ["5.0L V8", "3.5L V6 EcoBoost"] },
  { make: "Chevrolet", model: "Camaro", years: [2016, 2019, 2022], engines: ["6.2L V8", "3.6L V6"] },
  { make: "Chevrolet", model: "Silverado 1500", years: [2018, 2021], engines: ["5.3L V8"] },
  { make: "Dodge", model: "Challenger", years: [2017, 2020], engines: ["6.4L V8 SRT", "3.6L V6"] },
  { make: "Dodge", model: "Charger", years: [2018, 2021], engines: ["5.7L V8", "3.6L V6"] },
  { make: "Toyota", model: "Tacoma", years: [2017, 2020, 2023], engines: ["3.5L V6"] },
  { make: "Toyota", model: "Supra", years: [2020, 2022], engines: ["3.0L I6 Turbo"] },
  { make: "Honda", model: "Civic Si", years: [2017, 2020, 2023], engines: ["1.5L I4 Turbo"] },
  { make: "Honda", model: "Accord", years: [2019, 2022], engines: ["2.0L I4 Turbo", "1.5L I4 Turbo"] },
  { make: "Subaru", model: "WRX", years: [2016, 2019, 2022], engines: ["2.0L H4 Turbo"] },
  { make: "Subaru", model: "BRZ", years: [2018, 2022], engines: ["2.4L H4"] },
  { make: "BMW", model: "M3", years: [2017, 2021], engines: ["3.0L I6 Twin-Turbo"] },
  { make: "Nissan", model: "370Z", years: [2016, 2019], engines: ["3.7L V6"] },
]

type VehicleInput = { year: number; make: string; model: string; engine: string }

const VEHICLE_INPUTS: VehicleInput[] = VEHICLE_LINES.flatMap((line) =>
  line.years.flatMap((year) =>
    line.engines.map((engine) => ({
      year,
      make: line.make,
      model: line.model,
      engine,
    }))
  )
)

// ---------------------------------------------------------------------------
// Win-R Racing products
// ---------------------------------------------------------------------------

type RacingProductTemplate = {
  key: string
  title: string
  category: string
  description: string
  price: number
  universal?: boolean
  fitMakes?: string[]
}

const RACING_PRODUCTS: RacingProductTemplate[] = [
  // Brakes
  { key: "brake-pads-front", title: "Performance Ceramic Brake Pads - Front", category: "Brakes", description: "Low-dust ceramic compound pads tuned for consistent bite under repeated hard stops.", price: 89.99 },
  { key: "brake-pads-rear", title: "Performance Ceramic Brake Pads - Rear", category: "Brakes", description: "Matching rear-axle pad set for balanced braking bias.", price: 79.99 },
  { key: "big-brake-kit", title: "6-Piston Big Brake Kit - Front", category: "Brakes", description: "Monoblock 6-piston calipers with 14in slotted rotors for serious track use.", price: 1299.0, fitMakes: ["Ford", "Chevrolet", "Dodge"] },
  { key: "ss-brake-lines", title: "Stainless Steel Brake Line Kit", category: "Brakes", description: "DOT-approved braided lines for a firmer pedal and reduced fade.", price: 129.0, universal: true },
  { key: "slotted-rotors", title: "Slotted & Drilled Brake Rotors - Pair", category: "Brakes", description: "Improved heat dissipation and pad bite over stock rotors.", price: 219.0 },
  // Suspension
  { key: "coilover-kit", title: "Adjustable Coilover Suspension Kit", category: "Suspension", description: "32-way dampening adjustment with height-adjustable perches.", price: 1499.0 },
  { key: "lowering-springs", title: "Sport Lowering Springs", category: "Suspension", description: "Progressive-rate springs for a 1.2-1.5in drop with retained ride quality.", price: 329.0 },
  { key: "sway-bar-kit", title: "Front & Rear Sway Bar Kit", category: "Suspension", description: "Adjustable end links reduce body roll through corners.", price: 389.0 },
  { key: "strut-tower-brace", title: "Strut Tower Brace", category: "Suspension", description: "Bolt-on chassis stiffener that sharpens turn-in response.", price: 179.0, universal: true },
  { key: "control-arms", title: "Adjustable Rear Control Arms", category: "Suspension", description: "Correct alignment geometry after lowering, with rod-end joints.", price: 449.0 },
  // Exhaust
  { key: "catback-exhaust", title: "Cat-Back Performance Exhaust System", category: "Exhaust", description: "Mandrel-bent stainless piping with a deeper, sportier tone.", price: 899.0 },
  { key: "axle-back-exhaust", title: "Axle-Back Exhaust System", category: "Exhaust", description: "Bolt-on axle-back with polished dual tips.", price: 649.0 },
  { key: "headers", title: "Long-Tube Header Set", category: "Exhaust", description: "Equal-length primaries for improved exhaust scavenging and power.", price: 799.0 },
  { key: "exhaust-tips", title: "Bolt-On Exhaust Tips - Pair", category: "Exhaust", description: "Polished stainless tips, clamp-on installation.", price: 89.0, universal: true },
  { key: "resonator-delete", title: "Resonator Delete Pipe", category: "Exhaust", description: "Direct-fit resonator delete for a louder exhaust note.", price: 189.0 },
  // Engine & Drivetrain
  { key: "cold-air-intake-eng", title: "Short Ram Air Intake System", category: "Engine & Drivetrain", description: "High-flow cotton filter and mandrel-bent tube for improved throttle response.", price: 349.0 },
  { key: "clutch-kit", title: "Stage 2 Performance Clutch Kit", category: "Engine & Drivetrain", description: "Uprated clutch and flywheel kit rated for moderate power increases.", price: 599.0 },
  { key: "short-shifter", title: "Short-Throw Shifter", category: "Engine & Drivetrain", description: "Reduces throw distance by up to 40% for quicker shifts.", price: 219.0, universal: true },
  { key: "supercharger-pulley", title: "Supercharger Pulley Kit", category: "Engine & Drivetrain", description: "Reduced-diameter pulley for increased boost on supercharged applications.", price: 259.0, fitMakes: ["Ford", "Chevrolet", "Dodge"] },
  { key: "oil-filter", title: "High-Flow Oil Filter", category: "Engine & Drivetrain", description: "Universal-fit filter with a higher flow rate than stock.", price: 19.0, universal: true },
  // Wheels & Tires
  { key: "forged-wheel-set", title: "18in Forged Alloy Wheel Set", category: "Wheels & Tires", description: "Lightweight forged wheels, set of four.", price: 1899.0 },
  { key: "wheel-spacers", title: "Wheel Spacer Kit", category: "Wheels & Tires", description: "Hub-centric spacers for improved stance and stability.", price: 99.0, universal: true },
  { key: "lug-nuts", title: "Extended Racing Lug Nuts - Set of 20", category: "Wheels & Tires", description: "Forged steel lug nuts with anti-theft lock set.", price: 59.0, universal: true },
  { key: "track-tires", title: "Track-Focused Summer Tire - Each", category: "Wheels & Tires", description: "High-grip compound developed for autocross and track days.", price: 259.0, universal: true },
  { key: "tpms-sensors", title: "TPMS Sensor Kit", category: "Wheels & Tires", description: "Direct-fit replacement tire pressure sensors, set of four.", price: 129.0, universal: true },
  // Cooling & Air Intake
  { key: "aluminum-radiator", title: "High-Capacity Aluminum Radiator", category: "Cooling & Air Intake", description: "Dual-pass aluminum core for improved cooling under load.", price: 429.0 },
  { key: "oil-cooler", title: "Engine Oil Cooler Kit", category: "Cooling & Air Intake", description: "Thermostatic oil cooler kit for sustained track use.", price: 349.0 },
  { key: "cold-air-intake", title: "Cold Air Intake System", category: "Cooling & Air Intake", description: "Heat-shielded intake box that draws in cooler, denser air.", price: 299.0 },
  { key: "silicone-hose-kit", title: "Silicone Radiator Hose Kit", category: "Cooling & Air Intake", description: "High-temp silicone hoses, resistant to cracking and swelling.", price: 149.0 },
  { key: "fan-shroud", title: "Performance Cooling Fan & Shroud", category: "Cooling & Air Intake", description: "High-CFM electric fan with a direct-fit shroud.", price: 219.0, universal: true },
]

// ---------------------------------------------------------------------------
// Win-R Collective apparel
// ---------------------------------------------------------------------------

type CollectiveProductTemplate = {
  key: string
  title: string
  category: string
  description: string
  price: number
  variantType: "size-color" | "color" | "single"
}

const COLLECTIVE_PRODUCTS: CollectiveProductTemplate[] = [
  { key: "tee-heritage", title: "Heritage Logo Tee", category: "T-Shirts", description: "Heavyweight cotton tee with the Win-R heritage crest.", price: 34.0, variantType: "size-color" },
  { key: "tee-motorsport", title: "Motorsport Graphic Tee", category: "T-Shirts", description: "Vintage-inspired motorsport graphic print.", price: 36.0, variantType: "size-color" },
  { key: "tee-minimal", title: "Minimal Wordmark Tee", category: "T-Shirts", description: "Clean wordmark tee in a relaxed fit.", price: 32.0, variantType: "size-color" },
  { key: "tee-garage", title: "Garage Crew Tee", category: "T-Shirts", description: "Distressed graphic celebrating the Win-R garage crew.", price: 34.0, variantType: "size-color" },
  { key: "tee-longsleeve", title: "Long Sleeve Wordmark Tee", category: "T-Shirts", description: "Long sleeve version of our signature wordmark tee.", price: 42.0, variantType: "size-color" },
  { key: "hoodie-heritage", title: "Heritage Pullover Hoodie", category: "Hoodies & Outerwear", description: "Midweight fleece pullover with embroidered crest.", price: 78.0, variantType: "size-color" },
  { key: "hoodie-zip", title: "Full-Zip Track Hoodie", category: "Hoodies & Outerwear", description: "Zip-up hoodie with ribbed cuffs and side pockets.", price: 82.0, variantType: "size-color" },
  { key: "jacket-bomber", title: "Bomber Racing Jacket", category: "Hoodies & Outerwear", description: "Satin bomber jacket with embroidered sleeve patches.", price: 149.0, variantType: "size-color" },
  { key: "jacket-windbreaker", title: "Pit Crew Windbreaker", category: "Hoodies & Outerwear", description: "Lightweight windbreaker inspired by pit crew jackets.", price: 98.0, variantType: "size-color" },
  { key: "cap-snapback", title: "Snapback Cap", category: "Headwear", description: "Structured snapback with embroidered logo.", price: 32.0, variantType: "color" },
  { key: "cap-trucker", title: "Trucker Cap", category: "Headwear", description: "Mesh-back trucker cap, adjustable snap closure.", price: 28.0, variantType: "color" },
  { key: "beanie-cuffed", title: "Cuffed Knit Beanie", category: "Headwear", description: "Ribbed knit beanie with woven label.", price: 26.0, variantType: "color" },
  { key: "bucket-hat", title: "Garage Bucket Hat", category: "Headwear", description: "Cotton twill bucket hat with embroidered logo.", price: 30.0, variantType: "color" },
  { key: "keychain-leather", title: "Leather Keychain Fob", category: "Accessories", description: "Full-grain leather fob with debossed logo.", price: 22.0, variantType: "single" },
  { key: "sticker-pack", title: "Sticker Pack", category: "Accessories", description: "Set of 6 die-cut vinyl stickers.", price: 12.0, variantType: "single" },
  { key: "enamel-pin", title: "Enamel Pin Set", category: "Accessories", description: "Set of 3 hard-enamel collectible pins.", price: 18.0, variantType: "single" },
  { key: "duffel-bag", title: "Weekend Duffel Bag", category: "Accessories", description: "Canvas duffel with leather trim, embroidered logo.", price: 89.0, variantType: "single" },
]

// ---------------------------------------------------------------------------
// Win-R Sim products
// ---------------------------------------------------------------------------

type SimProductTemplate = {
  key: string
  title: string
  category: string
  description: string
  price: number
  metadata: Record<string, unknown>
}

const SIM_PRODUCTS: SimProductTemplate[] = [
  { key: "wheelbase-dd-8", title: "Direct Drive Wheelbase - 8Nm", category: "Wheels & Wheelbases", description: "Direct drive force feedback wheelbase for realistic road feel.", price: 899.0, metadata: { compatible_platforms: ["PC"], connection: "USB", torque_nm: 8 } },
  { key: "wheelbase-dd-15", title: "Direct Drive Wheelbase - 15Nm", category: "Wheels & Wheelbases", description: "High-torque direct drive base for competitive sim racers.", price: 1499.0, metadata: { compatible_platforms: ["PC"], connection: "USB", torque_nm: 15 } },
  { key: "rim-gt", title: "GT-Style Sim Racing Wheel Rim", category: "Wheels & Wheelbases", description: "Leather-wrapped GT rim with magnetic paddle shifters.", price: 349.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"], connection: "Quick Release" } },
  { key: "pedals-hydraulic", title: "Hydraulic Load Cell Pedal Set", category: "Pedals", description: "Three-pedal set with a hydraulic brake for progressive resistance.", price: 649.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"], connection: "USB", pedal_count: 3 } },
  { key: "pedals-entry", title: "Entry-Level Pedal Set", category: "Pedals", description: "Two-pedal set with adjustable spring resistance.", price: 149.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"], connection: "USB", pedal_count: 2 } },
  { key: "pedals-handbrake", title: "Add-On Hydraulic Handbrake", category: "Pedals", description: "Standalone hydraulic handbrake for rally and drift setups.", price: 229.0, metadata: { compatible_platforms: ["PC"], connection: "USB" } },
  { key: "shifter-sequential", title: "Sequential Shifter", category: "Shifters & Handbrakes", description: "Compact sequential shifter with adjustable paddle throw.", price: 199.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"], connection: "USB" } },
  { key: "shifter-hpattern", title: "H-Pattern Shifter - 6 Speed", category: "Shifters & Handbrakes", description: "Realistic H-pattern shifter with adjustable gate.", price: 249.0, metadata: { compatible_platforms: ["PC"], connection: "USB", gears: 6 } },
  { key: "cockpit-aluminum", title: "Aluminum Profile Racing Cockpit", category: "Cockpits & Rigs", description: "Modular aluminum extrusion rig compatible with most wheel/pedal brands.", price: 799.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"], adjustable: true } },
  { key: "cockpit-seat", title: "Racing Seat with Rig Mount", category: "Cockpits & Rigs", description: "Bucket-style racing seat with universal rig mounting brackets.", price: 449.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"] } },
  { key: "monitor-stand", title: "Triple Monitor Stand", category: "Accessories", description: "Adjustable triple-monitor stand for immersive sim setups.", price: 279.0, metadata: { compatible_platforms: ["PC", "PS5", "Xbox"], monitor_count: 3 } },
  { key: "sim-button-box", title: "Programmable Button Box", category: "Accessories", description: "20-button programmable box for pit and car controls.", price: 129.0, metadata: { compatible_platforms: ["PC"], connection: "USB", buttons: 20 } },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickVehicles<T extends { make: string }>(
  vehicles: T[],
  key: string,
  count: number
): T[] {
  if (!vehicles.length) return []
  const hash = [...key].reduce((a, c) => a + c.charCodeAt(0), 0)
  const start = hash % vehicles.length
  const picked: T[] = []
  for (let i = 0; i < count && i < vehicles.length; i++) {
    picked.push(vehicles[(start + i) % vehicles.length])
  }
  return picked
}

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const fitmentModuleService: FitmentModuleService =
    container.resolve(FITMENT_MODULE)

  const stripeEnabled = Boolean(process.env.STRIPE_API_KEY)

  logger.info("Seeding store, sales channel, and API key...")
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        { name: "Win-R Automotive", description: "Default sales channel" },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Win-R Storefront",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel.id] },
  })

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Win-R Automotive",
          supported_currencies: [{ currency_code: "usd", is_default: true }],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  })

  logger.info("Seeding US region and tax region...")
  const {
    result: [region],
  } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: stripeEnabled
            ? ["pp_system_default", "pp_stripe_stripe"]
            : ["pp_system_default"],
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "us", provider_id: "tp_system" }],
  })

  logger.info("Seeding stock location and fulfillment...")
  const {
    result: [stockLocation],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Win-R Automotive Warehouse",
          address: { city: "Charlotte", country_code: "US", address_1: "" },
        },
      ],
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Win-R Automotive delivery",
    type: "shipping",
    service_zones: [
      {
        name: "United States",
        geo_zones: [{ country_code: "us", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Standard", description: "Ships in 3-5 business days.", code: "standard" },
        prices: [
          { currency_code: "usd", amount: 9.99 },
          { region_id: region.id, amount: 9.99 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Express", description: "Ships in 1-2 business days.", code: "express" },
        prices: [
          { currency_code: "usd", amount: 24.99 },
          { region_id: region.id, amount: 24.99 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel.id] },
  })

  // -------------------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------------------
  logger.info("Seeding category tree...")

  const { result: topCategories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Win-R Racing", is_active: true, metadata: { division: "racing" } },
        { name: "Win-R Collective", is_active: true, metadata: { division: "collective" } },
        { name: "Win-R Sim", is_active: true, metadata: { division: "sim" } },
      ],
    },
  })

  const racingTop = topCategories.find((c) => c.name === "Win-R Racing")!
  const collectiveTop = topCategories.find((c) => c.name === "Win-R Collective")!
  const simTop = topCategories.find((c) => c.name === "Win-R Sim")!

  const racingSubNames = ["Brakes", "Suspension", "Exhaust", "Engine & Drivetrain", "Wheels & Tires", "Cooling & Air Intake"]
  const collectiveSubNames = ["T-Shirts", "Hoodies & Outerwear", "Headwear", "Accessories"]
  const simSubNames = ["Wheels & Wheelbases", "Pedals", "Shifters & Handbrakes", "Cockpits & Rigs", "Accessories"]

  const { result: subCategories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        ...racingSubNames.map((name) => ({
          name,
          is_active: true,
          parent_category_id: racingTop.id,
          metadata: { division: "racing" },
        })),
        ...collectiveSubNames.map((name) => ({
          name,
          is_active: true,
          parent_category_id: collectiveTop.id,
          metadata: { division: "collective" },
        })),
        ...simSubNames.map((name) => ({
          name: `Sim ${name}`,
          is_active: true,
          parent_category_id: simTop.id,
          metadata: { division: "sim" },
        })),
      ],
    },
  })

  const categoryId = (division: "racing" | "collective" | "sim", name: string) => {
    const lookupName = division === "sim" ? `Sim ${name}` : name
    const found = subCategories.find((c) => c.name === lookupName)
    if (!found) throw new Error(`Category not found: ${lookupName}`)
    return found.id
  }

  // -------------------------------------------------------------------------
  // Vehicles
  // -------------------------------------------------------------------------
  logger.info(`Seeding ${VEHICLE_INPUTS.length} vehicles...`)
  const createdVehicles = await fitmentModuleService.createVehicles(
    VEHICLE_INPUTS
  )

  // -------------------------------------------------------------------------
  // Racing products
  // -------------------------------------------------------------------------
  logger.info(`Seeding ${RACING_PRODUCTS.length} Win-R Racing products...`)
  const { result: racingProducts } = await createProductsWorkflow(
    container
  ).run({
    input: {
      products: RACING_PRODUCTS.map((tmpl) => ({
        title: tmpl.title,
        category_ids: [categoryId("racing", tmpl.category)],
        description: tmpl.description,
        handle: `racing-${tmpl.key}`,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        images: [{ url: img(`racing-${tmpl.key}`) }],
        options: [{ title: "Package", values: ["Standard"] }],
        variants: [
          {
            title: "Standard",
            sku: `RAC-${tmpl.key.toUpperCase()}`,
            options: { Package: "Standard" },
            prices: [{ amount: tmpl.price, currency_code: "usd" }],
          },
        ],
        sales_channels: [{ id: defaultSalesChannel.id }],
      })),
    },
  })

  const fitmentRows: Record<string, unknown>[] = []
  racingProducts.forEach((product, idx) => {
    const tmpl = RACING_PRODUCTS[idx]
    if (tmpl.universal) {
      fitmentRows.push({
        product_id: product.id,
        vehicle_id: null,
        is_universal: true,
        notes: null,
      })
      return
    }
    const candidates = tmpl.fitMakes
      ? createdVehicles.filter((v) => tmpl.fitMakes!.includes(v.make))
      : createdVehicles
    const fitted = pickVehicles(candidates, tmpl.key, 5)
    fitted.forEach((v) => {
      fitmentRows.push({
        product_id: product.id,
        vehicle_id: v.id,
        is_universal: false,
        notes: null,
      })
    })
  })
  await fitmentModuleService.createProductFitments(fitmentRows)

  // -------------------------------------------------------------------------
  // Collective products
  // -------------------------------------------------------------------------
  logger.info(`Seeding ${COLLECTIVE_PRODUCTS.length} Win-R Collective products...`)
  await createProductsWorkflow(container).run({
    input: {
      products: COLLECTIVE_PRODUCTS.map((tmpl) => {
        if (tmpl.variantType === "size-color") {
          const sizes = ["S", "M", "L", "XL"]
          const colors = ["Black", "White"]
          return {
            title: tmpl.title,
            category_ids: [categoryId("collective", tmpl.category)],
            description: tmpl.description,
            handle: `collective-${tmpl.key}`,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: img(`collective-${tmpl.key}`) }],
            options: [
              { title: "Size", values: sizes },
              { title: "Color", values: colors },
            ],
            variants: sizes.flatMap((size) =>
              colors.map((color) => ({
                title: `${size} / ${color}`,
                sku: `COL-${tmpl.key.toUpperCase()}-${size}-${color.toUpperCase()}`,
                options: { Size: size, Color: color },
                prices: [{ amount: tmpl.price, currency_code: "usd" }],
              }))
            ),
            sales_channels: [{ id: defaultSalesChannel.id }],
          }
        }
        if (tmpl.variantType === "color") {
          const colors = ["Black", "White", "Navy"]
          return {
            title: tmpl.title,
            category_ids: [categoryId("collective", tmpl.category)],
            description: tmpl.description,
            handle: `collective-${tmpl.key}`,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: img(`collective-${tmpl.key}`) }],
            options: [{ title: "Color", values: colors }],
            variants: colors.map((color) => ({
              title: color,
              sku: `COL-${tmpl.key.toUpperCase()}-${color.toUpperCase()}`,
              options: { Color: color },
              prices: [{ amount: tmpl.price, currency_code: "usd" }],
            })),
            sales_channels: [{ id: defaultSalesChannel.id }],
          }
        }
        return {
          title: tmpl.title,
          category_ids: [categoryId("collective", tmpl.category)],
          description: tmpl.description,
          handle: `collective-${tmpl.key}`,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img(`collective-${tmpl.key}`) }],
          options: [{ title: "Type", values: ["Standard"] }],
          variants: [
            {
              title: "Standard",
              sku: `COL-${tmpl.key.toUpperCase()}`,
              options: { Type: "Standard" },
              prices: [{ amount: tmpl.price, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        }
      }),
    },
  })

  // -------------------------------------------------------------------------
  // Sim products
  // -------------------------------------------------------------------------
  logger.info(`Seeding ${SIM_PRODUCTS.length} Win-R Sim products...`)
  await createProductsWorkflow(container).run({
    input: {
      products: SIM_PRODUCTS.map((tmpl) => ({
        title: tmpl.title,
        category_ids: [categoryId("sim", tmpl.category)],
        description: tmpl.description,
        handle: `sim-${tmpl.key}`,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        images: [{ url: img(`sim-${tmpl.key}`) }],
        metadata: tmpl.metadata,
        options: [{ title: "Package", values: ["Standard"] }],
        variants: [
          {
            title: "Standard",
            sku: `SIM-${tmpl.key.toUpperCase()}`,
            options: { Package: "Standard" },
            prices: [{ amount: tmpl.price, currency_code: "usd" }],
          },
        ],
        sales_channels: [{ id: defaultSalesChannel.id }],
      })),
    },
  })

  // -------------------------------------------------------------------------
  // Inventory - effectively unlimited stock for demo purposes
  // -------------------------------------------------------------------------
  logger.info("Seeding inventory levels...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1_000_000,
        inventory_item_id: item.id,
      })),
    },
  })

  logger.info("Seed complete.")
  logger.info(`Publishable API key: ${publishableApiKey.id}`)
}
