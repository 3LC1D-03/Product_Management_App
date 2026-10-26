import systemErrorTransparent from '../assets/productimages/systemerror_nobg.png'
import wastelandTransparent from '../assets/productimages/wasteland_nobg.png'
import eternalTransparent from '../assets/productimages/eternal_nobg.png'
import divineRuinTransparent from '../assets/productimages/DivineRuin_nobg.png'
import overgrowthTransparent from '../assets/productimages/overgrowth_nobg.png'
import desertOdysseyTransparent from '../assets/productimages/DesertOdyssey_nobg.png'
import silentStateTransparent from '../assets/productimages/SilentState_nobg.png'
import staticVoidTransparent from '../assets/productimages/StaticVoid_nobg.png'
import sector04Transparent from '../assets/productimages/Sector04_nobg.png'
import voidwalkerTransparent from '../assets/productimages/voidwalker_nobg.png'
import terraOutpostTransparent from '../assets/productimages/Terra_nobg.png'
import ascensionTransparent from '../assets/productimages/ascension_nobg.png'

/** Shared product information. */
export type ProductInfo = {
  id: string
  name: string
  category: string
  /** Demo score on a 0–5 scale, assigned for the storefront preview. */
  rating: number
  sizes: string[]
  /** Total stock for the product, not the quantity selected for purchase. */
  quantity: number
  /** Numeric amount in PHP, ready for calculations and currency formatting. */
  price: number
  currency: 'PHP'
  description: string
  specifications: string[]
  images: {
    featured: string
    transparent: string
  }
}

/** Shared catalog data for the showcase and future product views. */
export const products: ProductInfo[] = [
  {
    id: 'system-error',
    name: '"System Error" Cybernetic Division Oversized Tee',
    category: 'Graphic Tees',
    rating: 4.8,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 1200,
    currency: 'PHP',
    description: 'A vintage-washed, drop-shoulder graphic tee featuring a high-contrast cybernetic android and retro-futuristic terminal grids.',
    specifications: [
      'Oversized fit',
      'Drop-shoulder silhouette',
      'Vintage-washed finish',
      'High-contrast cybernetic android and retro-futuristic terminal grid artwork',
    ],
    images: {
      featured: systemErrorTransparent,
      transparent: systemErrorTransparent,
    },
  },
  {
    id: 'wasteland-chaos',
    name: '"Wasteland Chaos" Heavy Metal/Grunge Oversized Tee',
    category: 'Graphic Tees',
    rating: 4.6,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 1250,
    currency: 'PHP',
    description: 'An aggressive, grunge-inspired oversized t-shirt in a washed-out vintage charcoal/black, featuring a grim reaper surrounded by metallic chrome stars, barbed wire, and distressed crimson typography.',
    specifications: [
      'Oversized fit',
      'Heavy metal/grunge-inspired style',
      'Washed-out vintage charcoal/black color',
      'Grim reaper, metallic chrome stars, barbed wire, and distressed crimson typography artwork',
    ],
    images: {
      featured: wastelandTransparent,
      transparent: wastelandTransparent,
    },
  },
  {
    id: 'eternal-reverie',
    name: '"Eternal Reverie" Vintage Earthy Surrealism Oversized Tee',
    category: 'Graphic Tees',
    rating: 4.9,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 1200,
    currency: 'PHP',
    description: 'An off-white, drop-shoulder oversized tee featuring intricate, vintage-inspired hand-drawn surrealism. The artwork displays a cosmic sun-eye, a detailed skull-moth, and lush botanical roses in warm, faded earth tones.',
    specifications: [
      'Oversized fit',
      'Drop-shoulder silhouette',
      'Off-white color',
      'Vintage-inspired hand-drawn surrealism in warm, faded earth tones',
      'Cosmic sun-eye, skull-moth, and botanical rose artwork',
    ],
    images: {
      featured: eternalTransparent,
      transparent: eternalTransparent,
    },
  },
  {
    id: 'divine-ruin',
    name: '"Divine Ruin" Gothic Angel Oversized Hoodie',
    category: 'Hoodies',
    rating: 4.7,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 2600,
    currency: 'PHP',
    description: 'An ultra-heavyweight, 400GSM drop-shoulder hoodie in a heavily washed vintage charcoal black. Features a stark classical weeping angel statue overlaid with vibrant, chaotic street graffiti, cyber-punk grunge stars, and distressed gothic typography reading "DIVINE RUIN" and "CHRONICLES OF THE FALLEN."',
    specifications: [
      'Oversized fit and drop-shoulder silhouette',
      'Ultra-heavyweight 400GSM fabric',
      'Heavily washed vintage charcoal black',
      'Weeping angel statue, street graffiti, and cyber-punk grunge stars',
      'Distressed DIVINE RUIN and CHRONICLES OF THE FALLEN typography',
    ],
    images: {
      featured: divineRuinTransparent,
      transparent: divineRuinTransparent,
    },
  },
  {
    id: 'overgrowth',
    name: '"Overgrowth" Bio-Mechanical Heavyweight Hoodie (Washed Forest Green)',
    category: 'Hoodies',
    rating: 5.0,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 2600,
    currency: 'PHP',
    description: 'An ultra-heavyweight, 400GSM drop-shoulder hoodie in a deeply washed forest green. It features a stark bio-mechanical cybernetic skull intertwined with overgrown natural vines, jungle foliage, and cyber-circuit elements. Highlights of neon orange, acid green, and natural rust are offset with industrial typography reading "OVERGROWTH" and "FUTURE APOCALYPSE / DIGITAL FLORA".',
    specifications: [
      'Drop-shoulder silhouette',
      'Ultra-heavyweight 400GSM fabric',
      'Deeply washed forest green',
      'Bio-mechanical skull, natural vines, jungle foliage, and cyber-circuit artwork',
      'Neon orange, acid green, and natural rust highlights',
      'OVERGROWTH and FUTURE APOCALYPSE / DIGITAL FLORA industrial typography',
    ],
    images: {
      featured: overgrowthTransparent,
      transparent: overgrowthTransparent,
    },
  },
  {
    id: 'desert-odyssey',
    name: '"Desert Odyssey" Lost Expedition Heavyweight Hoodie (Dusty Sand-Beige)',
    category: 'Hoodies',
    rating: 4.5,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 2650,
    currency: 'PHP',
    description: 'An oversized, drop-shoulder hoodie in pigment-dyed dusty sand-beige with a heavily worn, vintage appearance. It showcases an intricate cosmic-explorer illustration of an astronaut traversing a dystopian desert landscape under a massive sun/moon eclipse, featuring crumbling cyber-temple ruins and a giant compass. It boasts rich terracotta, dark brown, and vintage golden-orange tones, topped with rugged distressed typography reading "DESERT ODYSSEY" and "LOST EXPEDITION / BEYOND THE DUNE".',
    specifications: [
      'Oversized fit and drop-shoulder silhouette',
      'Pigment-dyed dusty sand-beige with a worn vintage finish',
      'Astronaut, desert landscape, eclipse, cyber-temple ruins, and compass artwork',
      'Terracotta, dark brown, and vintage golden-orange tones',
      'Distressed DESERT ODYSSEY and LOST EXPEDITION / BEYOND THE DUNE typography',
    ],
    images: {
      featured: desertOdysseyTransparent,
      transparent: desertOdysseyTransparent,
    },
  },
  {
    id: 'silent-state',
    name: '"Silent State" Raw-Edge Drop-Arm Tank Top (Bone/Off-White)',
    category: 'Tank Tops',
    rating: 4.1,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 950,
    currency: 'PHP',
    description: 'An oversized, drop-armhole boxy tank top crafted from 280GSM heavyweight slub cotton in a natural bone/off-white. Tailored with a relaxed, slouchy silhouette, it features raw-cut armholes and a distressed, slightly rolled hemline for an effortless worn-in look. The design keeps it strictly minimalist with a tiny, high-contrast fine-line graphic on the chest reading "SILENT STATE // 01-A" beneath a subtle, abstract cyber-zen horizon.',
    specifications: [
      'Oversized boxy fit with drop armholes',
      '280GSM heavyweight slub cotton',
      'Natural bone/off-white',
      'Raw-cut armholes and a distressed, slightly rolled hemline',
      'Minimal SILENT STATE // 01-A chest graphic and abstract cyber-zen horizon',
    ],
    images: {
      featured: silentStateTransparent,
      transparent: silentStateTransparent,
    },
  },
  {
    id: 'static-void',
    name: '"Static Void" Custom Split-Hem Tank Top (Acid Washed Charcoal)',
    category: 'Tank Tops',
    rating: 4.2,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 980,
    currency: 'PHP',
    description: 'An asymmetrical, heavyweight 280GSM muscle tank in a heavily faded acid-washed charcoal. Tailored with a distinct boxy drop-armhole cut, it features split-side hems (longer in the back) reinforced with subtle contrast bar-tack stitching, and an offset vertical panel seam running down the left chest.',
    specifications: [
      'Boxy muscle-tank fit with drop armholes',
      'Heavyweight 280GSM fabric',
      'Heavily faded acid-washed charcoal',
      'Asymmetrical split-side hems with a longer back',
      'Contrast bar-tack stitching and an offset left-chest vertical panel seam',
    ],
    images: {
      featured: staticVoidTransparent,
      transparent: staticVoidTransparent,
    },
  },
  {
    id: 'sector-04',
    name: '"Sector 04" Panel-Yoke Curved Tank Top (Faded Moss Green)',
    category: 'Tank Tops',
    rating: 4.0,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 980,
    currency: 'PHP',
    description: 'An oversized, drop-armhole muscle tank crafted from heavyweight 280GSM natural-dyed moss green cotton. It features custom-tailored panels, including an overlapping shoulder yoke across the upper chest with raw flatlock-seamed edges, and a subtly curved (scalloped) hemline with natural rolling. For a minimalist, industrial touch, it has a tiny dark grey fine-line graphic on the left chest that reads "MOSS // SECTOR 04" alongside an abstract barcode emblem, and a small woven canvas tab at the bottom hem. Perfect for an organic, utilitarian look.',
    specifications: [
      'Oversized muscle-tank fit with drop armholes',
      'Heavyweight 280GSM natural-dyed moss green cotton',
      'Overlapping shoulder yoke and raw flatlock-seamed panel edges',
      'Curved scalloped hemline with natural rolling',
      'MOSS // SECTOR 04 left-chest graphic, barcode emblem, and woven canvas hem tab',
    ],
    images: {
      featured: sector04Transparent,
      transparent: sector04Transparent,
    },
  },
  {
    id: 'voidwalker',
    name: '"Voidwalker" Custom Cut-and-Sew Heavyweight Sweatshirt',
    category: 'Sweatshirts',
    rating: 4.4,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 2500,
    currency: 'PHP',
    description: 'A highly custom, deconstructed crewneck sweatshirt made from 450GSM heavyweight cotton. Featuring an asymmetric, paneled cut-and-sew design in washed charcoal and jet black, this piece is tailored with raw-edge visible seams, tonal zig-zag overlock stitching, and distressed canvas patchwork. Graphic elements include a distressed "VOIDWALKER // SYSTEM BREAKDOWN 01-E" cyber-punk print, cybernetic skull illustration, and embroidered utility accents.',
    specifications: [
      'Deconstructed crewneck with asymmetric cut-and-sew panels',
      '450GSM heavyweight cotton',
      'Washed charcoal and jet black',
      'Raw-edge visible seams, tonal zig-zag overlock stitching, and distressed canvas patchwork',
      'VOIDWALKER // SYSTEM BREAKDOWN 01-E print, cybernetic skull, and embroidered utility accents',
    ],
    images: {
      featured: voidwalkerTransparent,
      transparent: voidwalkerTransparent,
    },
  },
  {
    id: 'terra-outpost',
    name: '"Terra Outpost" Deconstructed Cut-and-Sew Sweatshirt',
    category: 'Sweatshirts',
    rating: 4.3,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 2550,
    currency: 'PHP',
    description: 'An asymmetrical, multi-panel custom crewneck made from 450GSM heavyweight cotton in washed sage green, dark forest green, and faded charcoal. Features deconstructed paneling with visible contrast overlock stitching, raw-edged elbow patches, and canvas utility accents. The center features a "TERRA OUTPOST // SECTOR 04" cyber-organic graphic on a heavily distressed panel.',
    specifications: [
      'Asymmetrical multi-panel crewneck construction',
      '450GSM heavyweight cotton',
      'Washed sage green, dark forest green, and faded charcoal panels',
      'Visible contrast overlock stitching, raw-edged elbow patches, and canvas utility accents',
      'TERRA OUTPOST // SECTOR 04 cyber-organic graphic on a distressed center panel',
    ],
    images: {
      featured: terraOutpostTransparent,
      transparent: terraOutpostTransparent,
    },
  },
  {
    id: 'ascension-ashes-rust',
    name: '"Ascension / Ashes & Rust" Deconstructed Cut-and-Sew Sweatshirt',
    category: 'Sweatshirts',
    rating: 3.9,
    sizes: ['S', 'M', 'XL'],
    quantity: 10,
    price: 2650,
    currency: 'PHP',
    description: 'An ultra-premium, heavily deconstructed heavyweight sweatshirt crafted in an asymmetrical patchwork of faded rust-orange, burnt crimson, sun-faded vintage black, and textured cream panels. It is held together with jagged, contrast overlock stitches that highlight its industrial rebuild. Graphic features include a heavily distressed "ASCENSION / AFTERMATH // 03-A" phoenix artwork, canvas patch appliqués, and raw-edge elbow detailing. Completed with frayed, layered mock-neck and extra-long cuffs with thumbholes, this heavy-weight piece brings an apocalyptic, hand-reconstructed feel to any fit.',
    specifications: [
      'Heavyweight deconstructed sweatshirt with asymmetrical patchwork',
      'Faded rust-orange, burnt crimson, sun-faded vintage black, and textured cream panels',
      'Jagged contrast overlock stitching, canvas patch appliqués, and raw-edge elbows',
      'Distressed ASCENSION / AFTERMATH // 03-A phoenix artwork',
      'Frayed layered mock-neck and extra-long cuffs with thumbholes',
    ],
    images: {
      featured: ascensionTransparent,
      transparent: ascensionTransparent,
    },
  },
]
