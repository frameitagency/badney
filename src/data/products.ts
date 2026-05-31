import { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "bc-001",
    title: "Badney Cotton Premium Sweatshirt (Yellow)",
    price: 799.00,
    originalPrice: 950.00,
    rating: 4.9,
    category: "MEN",
    images: [
      "/src/assets/images/yellow_sweatshirt_1780198346869.png"
    ],
    description: "Our signature heavyweight yellow crewneck sweatshirt. Features premium combed cotton construction, custom Badney Cotton black contrast branding, and a warm interior perfect for versatile everyday layering under the South African sun.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Gold Mustard", value: "#eab308" },
      { name: "Coal Black", value: "#1a1a1a" }
    ],
    details: [
      "100% Super-soft ring-spun combed cotton",
      "Robust double-needle stitched ribbed crew collar",
      "Heavyweight 350GSM brushback interior fleece",
      "Designed and crafted locally in Johannesburg"
    ],
    isNew: true
  },
  {
    id: "bc-002",
    title: "Badney Cotton Premium Sweatshirt (White)",
    price: 799.00,
    originalPrice: 950.00,
    rating: 4.8,
    category: "MEN",
    images: [
      "/src/assets/images/white_sweatshirt_1780198364843.png"
    ],
    description: "Our pristine white crewneck sweatshirt styled in pure heavy ring-spun combed cotton. The central Badney Cotton emblem delivers sharp visual contrast suited for clean, minimalist street coordinate pairings.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Chalk White", value: "#ffffff" },
      { name: "Basalt Grey", value: "#64748b" }
    ],
    details: [
      "20/1 ultra-clean high gauge weave structure",
      "Pre-shrunk for consistent visual geometry and sizing",
      "Flexible split-seam side hems for premium comfort",
      "Embossed crisp black screen print focal detail"
    ],
    isBestSeller: true
  },
  {
    id: "bc-003",
    title: "Badney Cotton Heavyweight Knit Hoodie (Grey)",
    price: 1199.00,
    originalPrice: 1350.00,
    rating: 5.0,
    category: "MEN",
    images: [
      "/src/assets/images/grey_hoodie_1780198380942.png",
      "/src/assets/images/model_white_hoodie_1780196790776.png"
    ],
    description: "Built using our thickest brushed cotton weave. This premium grey hoodie features generous hood spacing with customized matte eyelets, high structural weight, and durable drawstring aglets.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Heather Grey", value: "#94a3b8" },
      { name: "Coal Black", value: "#1a1a1a" }
    ],
    details: [
      "400GSM dense premium knit fleeceback",
      "Deep kangaroo pouch with reinforced piping corners",
      "Adjustable double-layered heavy hood shell",
      "Ethically milled and finished in GP textile mills"
    ],
    isBestSeller: true
  },
  {
    id: "bc-004",
    title: "Badney Collegiate BD Crest Sweatshirt",
    price: 849.00,
    originalPrice: 999.00,
    rating: 4.9,
    category: "MEN",
    images: [
      "/src/assets/images/man_coffee_sweatshirt_1780198396172.png"
    ],
    description: "Our core lifestyle white sweater featuring a bold high-density monogram 'BD' flock print. Cut with comfortable dropped shoulder lines that offer a relaxed visual silhouette.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Raw White", value: "#f8f7f4" },
      { name: "Chalk Violet", value: "#cbd5e1" }
    ],
    details: [
      "Heavy brushed French terry cotton base structure",
      "Ultra-soft interior weave for comfortable all-day lounging",
      "Embossed thick-ink chest crest detailing",
      "Seamless layout for unrestricted range of motion"
    ],
    isNew: true
  },
  {
    id: "bc-005",
    title: "Badney Studio Purple Edition Tee",
    price: 399.00,
    rating: 4.7,
    category: "MEN",
    images: [
      "/src/assets/images/man_purple_tshirt_1780198411762.png"
    ],
    description: "The official Badney Studio photoshoot white t-shirt. Features standard boxy streetwear sizing, comfortable high rib neck column, and custom black block branding centered precisely.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Optic White", value: "#ffffff" }
    ],
    details: [
      "240GSM combed luxury ring-spun cotton fabric",
      "High-neck elastic neckband that refuses to sag",
      "High breathability under local climate limits",
      "Hand-pulled premium silk screen graphics"
    ]
  },
  {
    id: "bc-006",
    title: "Badney BD Monogram Ribbed Tee",
    price: 449.00,
    rating: 4.9,
    category: "WOMEN",
    images: [
      "/src/assets/images/ribbed_tshirt_close_1780198427615.png"
    ],
    description: "A highly meticulously constructed ribbed cotton crewneck showing off an elegant black embroidered monogram right at the heart. Perfect stand-alone or worn under structured varsity jackets.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ribbed Chalk", value: "#f1f5f9" }
    ],
    details: [
      "Heavy ribbed-gauge cotton weave knit design",
      "Hand-finished micro black monogram crest embroidery",
      "Reinforced double-stitching along sleeve margins",
      "Ultra-clean tailored shoulder alignment frame"
    ],
    isBestSeller: true
  },
  {
    id: "bc-007",
    title: "Badney Cotton Classic Afro Edition Tee",
    price: 399.00,
    rating: 4.8,
    category: "WOMEN",
    images: [
      "/src/assets/images/woman_bedroom_tshirt_1780198442699.png"
    ],
    description: "A tribute to warm South African spaces and minimalist living. Clean white combed cotton structure crafted for maximum softness and lightweight breathability.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Aesthetic Cream", value: "#fcfaf2" }
    ],
    details: [
      "100% fine organic long-loop combed cotton",
      "Preshrunk double wash treatment cycles done",
      "Silky touch feel with non-irritant smooth seams",
      "Made entirely from fair-wage Gauteng textile mills"
    ],
    isNew: true
  },
  {
    id: "bc-008",
    title: "Badney Midnight Onyx Essential Tee",
    price: 399.00,
    rating: 4.6,
    category: "MEN",
    images: [
      "/src/assets/images/black_tshirt_flat_1780198458828.png"
    ],
    description: "The deep black crewneck t-shirt. Composed on heavy combed cotton, boasting a high-contrast white Badney Cotton stamp across the midline.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx Black", value: "#1a1a1a" }
    ],
    details: [
      "Heavyweight 240GSM ring-spun cotton structure",
      "Resilient deep black dye resistant to sun fade",
      "Classic oversized streetwear fit profile",
      "Durable neckband ribbed collar detailing"
    ]
  },
  {
    id: "bc-009",
    title: "Badney Heavy Verified Black Tee",
    price: 449.00,
    rating: 5.0,
    category: "MEN",
    images: [
      "/src/assets/images/black_tshirt_tag_1780198474031.png"
    ],
    description: "Our premium heavyweight coal black tee, packaged directly with standard certified secure tags. Highly durable split stitches designed for extensive wear-and-wash routines.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx Black", value: "#1a1a1a" }
    ],
    details: [
      "Authentic thick combed ringspun yarn core",
      "Includes real weighted badney cotton paper hangtag",
      "Double needle coverstitch finish along all hem edges",
      "Tailor-milled and authenticated locally in SA"
    ],
    isNew: true
  }
];
