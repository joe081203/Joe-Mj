import { Product, HeroSlideData } from '../types';

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 1,
    heading: 'CONSCIOUS FIRE',
    kicker: 'LITUS · SS26 ARCHIVE',
    quote: undefined,
    description: 'Sculptural technical outerwear engineered with closed-loop organic marine fibers and bonded seams.',
    bgImage: '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
    ctaText: 'Explore Collection',
    ctaAction: 'shop',
    themeTone: 'marine',
  },
  {
    id: 2,
    heading: 'DIGITAL COUTURE',
    kicker: 'WEB3 ATELIER',
    quote: 'More than a brand, own an asset',
    description: 'Physical craftsmanship paired with an immutable on-chain digital twin.',
    bgImage: '/src/assets/images/litus_nft_digital_fashion_1792166656272.jpg',
    ctaText: 'NFT Market (Preview)',
    ctaAction: 'nft',
    themeTone: 'electric',
  },
  {
    id: 3,
    heading: 'THE LOTUS PRINCIPLE',
    kicker: 'CIRCULAR CRAFT',
    quote: 'Never wear same again',
    description: 'Regenerative organic fibers and modular silhouettes born from zero-waste philosophy.',
    bgImage: '/src/assets/images/litus_lotus_sustainability_1792166656259.jpg',
    ctaText: 'Read Our Story',
    ctaAction: 'story',
    themeTone: 'ethereal',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'litus-01',
    name: 'Atelier Technical Overshirt',
    category: 'shirts',
    price: 240,
    originalPrice: 280,
    description: 'Engineered boxy utility shirt cut from high-density Japanese recycled nylon and organic Supima cotton. Features matte tonal hardware and magnetic gusset pockets.',
    details: [
      'Two-way YKK waterproof zip front',
      'Dual concealed breast cargo pockets',
      'Bonded water-repellent laser seams',
      'Embedded NFC authenticity chip in left hem'
    ],
    fabric: '65% Organic Supima Cotton, 35% Econyl Regenerated Nylon',
    sustainabilityNote: 'Low-impact cold reactive dye saves 42L water per garment',
    image: '/src/assets/images/litus_technical_overshirt_1792166677796.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Marine Navy', hex: '#0f2b48' },
      { name: 'Obsidian Black', hex: '#111827' },
      { name: 'Chalk Stone', hex: '#e2e8f0' }
    ],
    isRecommended: true,
    isNFTReady: true,
    badge: 'Core Edition'
  },
  {
    id: 'litus-02',
    name: 'Archive 300GSM Heavyweight Tee',
    category: 'tees',
    price: 115,
    description: 'Substantial 300GSM organic cotton jersey with relaxed drop-shoulder drape and reinforced ribbed crewneck collar. Crisp micro-typographic back emblem.',
    details: [
      'Heavyweight 300GSM combed organic ring-spun cotton',
      'Pre-shrunk vintage bio-wash treatment',
      'Reinforced double-needle shoulder binding',
      'Micro-embroidered LITUS fire/lotus spark emblem'
    ],
    fabric: '100% GOTS Certified Organic Cotton',
    sustainabilityNote: 'Zero pesticide runoff, compostable biological inks',
    image: '/src/assets/images/litus_oversized_tee_1792166677289.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Chalk White', hex: '#f8fafc' },
      { name: 'Deep Marine', hex: '#1e3a8a' },
      { name: 'Washed Charcoal', hex: '#334155' }
    ],
    isRecommended: true,
    isNFTReady: false,
    badge: 'Bestseller'
  },
  {
    id: 'litus-03',
    name: 'Architectural Pleated Trousers',
    category: 'trousers',
    price: 295,
    description: 'Sculptural wide-leg trousers tailored with deep front inward pleats, concealed drawstring waist, and tailored ankle hems. Drapes effortlessly in motion.',
    details: [
      'Tailored double inward pleats for fluid volume',
      'Concealed elasticated internal waist cord',
      'Deep slash side pockets & back welt pockets',
      'Internal anti-static organic cupro lining'
    ],
    fabric: '70% Recycled Traceable Wool, 30% Tencel Lyocell',
    sustainabilityNote: 'Mulesing-free regenerative wool sourced with circular certification',
    image: '/src/assets/images/litus_cargo_trousers_1792166677989.jpg',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Charcoal Slate', hex: '#1e293b' },
      { name: 'Midnight Navy', hex: '#0f172a' },
      { name: 'Sand Dune', hex: '#cbd5e1' }
    ],
    isRecommended: true,
    isNFTReady: true,
    badge: 'Limited Run'
  },
  {
    id: 'litus-04',
    name: 'Modular Tactical Crossbody Pouch & Ring',
    category: 'accessories',
    price: 185,
    description: 'Precision weatherproof crossbody utility holster paired with a sculptural aerospace titanium signet ring. Fidlock V-buckle magnetic release.',
    details: [
      'German Fidlock magnetic slide-release buckle',
      'Ballistic Cordura waterproof exterior',
      'CNC milled grade-5 titanium unisex ring included',
      'Detachable military webbing strap with swivel carabiners'
    ],
    fabric: 'Cordura 500D Recycled Nylon & Aerospace Titanium',
    sustainabilityNote: 'Lifetime repair and refurbishment guarantee',
    image: '/src/assets/images/litus_minimal_accessory_1792166678035.jpg',
    sizes: ['One Size'],
    colors: [
      { name: 'Matte Stealth', hex: '#0a0e17' },
      { name: 'Glacier Blue', hex: '#38bdf8' }
    ],
    isRecommended: true,
    isNFTReady: true,
    badge: 'Web3 Ready'
  },
  {
    id: 'litus-05',
    name: 'Monolith Storm Shell Parka',
    category: 'shirts',
    price: 460,
    originalPrice: 520,
    description: 'Full-coverage weather armor built with 3-layer laminated bio-membrane. Geometric asymmetric front storm baffle and articulated storm hood.',
    details: [
      '20,000mm hydrostatic head waterproof rating',
      'Laser-cut ventilation ports under armpits',
      'Dual harness carry straps inside for over-shoulder wear',
      'Integrated NFT NFC verification chip'
    ],
    fabric: '3-Layer Bio-Based Membrane & Recycled Polyamide',
    sustainabilityNote: 'PFC-free water repellent finish; 100% microplastic-filtered',
    image: '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Deep Cobalt', hex: '#1d4ed8' },
      { name: 'Dark Slate', hex: '#0f172a' }
    ],
    isRecommended: false,
    isNFTReady: true,
    badge: 'Flagship'
  },
  {
    id: 'litus-06',
    name: 'Bioluminescent Lotus Boxy Tee',
    category: 'tees',
    price: 130,
    description: 'Relaxed fit tee featuring a subtle photochromic and light-reactive lotus botanical graphic that shifts luminescence in low-light environments.',
    details: [
      'Natural mineral phosphorescent pigment print',
      'Drop-shoulder boxy silhouette with wide sleeves',
      'Soft enzyme washed organic cotton jersey',
      'Custom woven identity label on outer seam'
    ],
    fabric: '100% Organic Aegean Cotton (260GSM)',
    sustainabilityNote: 'Certified non-toxic mineral dyes',
    image: '/src/assets/images/litus_oversized_tee_1792166677289.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crisp White', hex: '#ffffff' },
      { name: 'Electric Cyan Tint', hex: '#e0f2fe' }
    ],
    isRecommended: true,
    isNFTReady: true,
    isNewRelease: true,
    badge: 'Special Edition'
  },
  {
    id: 'litus-07',
    name: 'Zero-Waste Origami Cargo Pant',
    category: 'trousers',
    price: 310,
    description: 'Engineered using computational zero-waste origami pattern-making. Angular volumetric side pockets created without cutting away excess fabric.',
    details: [
      'Zero-fabric-waste algorithmic pattern engineering',
      'Ergonomic knee darts for natural movement',
      'Concealed magnetic pocket flaps',
      'Adjustable cord cinch cuffs at ankles'
    ],
    fabric: '98% Organic Cotton Ripstop, 2% Roica Recycled Elastane',
    sustainabilityNote: '0.00% fabric remnant sent to landfill',
    image: '/src/assets/images/litus_cargo_trousers_1792166677989.jpg',
    sizes: ['28', '30', '32', '34'],
    colors: [
      { name: 'Volcanic Ash', hex: '#18181b' },
      { name: 'Deep Navy', hex: '#0f172a' }
    ],
    isRecommended: false,
    isNFTReady: false,
    isNewRelease: true,
    badge: 'Zero Waste'
  },
  {
    id: 'litus-08',
    name: 'Bonded Seam Poplin Workshirt',
    category: 'shirts',
    price: 215,
    description: 'Crisp architectural button-down cut from high-thread count organic poplin. Hidden French placket with clean minimal collar stance.',
    details: [
      'High-density 120s two-ply organic cotton poplin',
      'Concealed placket with natural mother-of-pearl buttons',
      'Curved ergonomic hemline with gusset reinforcements',
      'Clean modern point collar'
    ],
    fabric: '100% Certified Organic Egyptian Cotton',
    sustainabilityNote: 'Ethically spun and woven in certified fair-trade mills',
    image: '/src/assets/images/litus_technical_overshirt_1792166677796.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Sky Ash', hex: '#93c5fd' },
      { name: 'Midnight', hex: '#090d16' }
    ],
    isRecommended: false,
    isNFTReady: false
  },
  {
    id: 'litus-09',
    name: 'Thermal Reactive Mock-Neck Top',
    category: 'tees',
    price: 145,
    description: 'Form-fitting base layer with micro-ribbed collar. Engineered thermal-adaptive bamboo fibers regulate surface body temperature.',
    details: [
      'Temperature-regulating bamboo and organic modal blend',
      'Ergonomic flatlock seams preventing skin chafing',
      'Thumbhole cuffs on sleeve hems',
      'Reflective micro-monogram on back spine'
    ],
    fabric: '70% Organic Bamboo Lyocell, 25% Modal, 5% Spandex',
    sustainabilityNote: 'Closed-loop chemical solvent recovery system',
    image: '/src/assets/images/litus_product_showcase_1792166656612.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Electric Dark', hex: '#070b12' },
      { name: 'Frost Blue', hex: '#bae6fd' }
    ],
    isRecommended: false,
    isNFTReady: true,
    badge: 'Thermal Tech'
  },
  {
    id: 'litus-10',
    name: 'Lotus Sculptural Titanium Cuff',
    category: 'accessories',
    price: 220,
    description: 'Minimalist ergonomic wrist cuff precision CNC-carved from aerospace titanium with satin micro-brushed finish and laser serialized edition number.',
    details: [
      'Machined from solid block grade-5 titanium',
      'Laser engraved brand ethos coordinates',
      'Hypoallergenic, ultra-lightweight (34 grams)',
      'Digital certificate of authenticity registered on-chain'
    ],
    fabric: '100% Aerospace Grade 5 Titanium',
    sustainabilityNote: 'Infinite recyclability with zero material degradation',
    image: '/src/assets/images/litus_minimal_accessory_1792166678035.jpg',
    sizes: ['S/M', 'M/L'],
    colors: [
      { name: 'Brushed Silver', hex: '#e2e8f0' },
      { name: 'Anodized Electric Blue', hex: '#0284c7' }
    ],
    isRecommended: true,
    isNFTReady: true,
    badge: 'NFT Linked',
    isNewRelease: true
  },
  {
    id: 'litus-combo-01',
    name: 'Lotus Capsule Co-ord Set (Duo)',
    category: 'combos',
    price: 450,
    originalPrice: 535,
    description: 'The definitive LITUS minimalist uniform. Pairs the boxy water-repellent Atelier Technical Overshirt with fluid Architectural Pleated Trousers for effortless proportion. Bundled with exclusive savings.',
    details: [
      'Includes 1x Atelier Technical Overshirt + 1x Architectural Pleated Trousers',
      'Harmonized natural mineral dye finish across both pieces',
      'Save $85 compared to individual garment purchase',
      'Dual encrypted NFC authenticity chips and free on-chain digital twin'
    ],
    fabric: 'Organic Supima Cotton, Econyl Regenerated Nylon & Recycled Wool',
    sustainabilityNote: 'Coordinated zero-waste cutting layout saves 1.8m fabric',
    image: '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Marine Navy Monolith', hex: '#0f2b48' },
      { name: 'Obsidian & Slate', hex: '#111827' }
    ],
    isRecommended: true,
    isNFTReady: true,
    isNewRelease: true,
    badge: 'Curated Duo · Save $85',
    comboItems: ['Atelier Technical Overshirt', 'Architectural Pleated Trousers'],
    comboSavingsUSD: 85
  },
  {
    id: 'litus-combo-02',
    name: 'Zen Biomimetic Minimalist Combo',
    category: 'combos',
    price: 375,
    originalPrice: 440,
    description: 'Bioluminescent lotus graphic heavyweight tee paired with algorithmic zero-waste origami cargo pants. Complete balance between biological serenity and utilitarian structure.',
    details: [
      'Includes 1x Bioluminescent Lotus Tee + 1x Zero-Waste Origami Cargo Pant',
      'Natural mineral phosphorescent pigment shifts in dim environments',
      'Save $65 compared to separate purchase',
      'Includes complimentary organic cotton protective garment bag'
    ],
    fabric: '100% Organic Aegean Cotton & Cotton Ripstop with Roica Recycled Elastane',
    sustainabilityNote: '100% biodegradable dyes and closed-loop water filtration',
    image: '/src/assets/images/litus_lotus_sustainability_1792166656259.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure White & Ash', hex: '#ffffff' },
      { name: 'Electric Cyan & Navy', hex: '#0284c7' }
    ],
    isRecommended: true,
    isNFTReady: true,
    isNewRelease: true,
    badge: 'Botanical Set · Save $65',
    comboItems: ['Bioluminescent Lotus Boxy Tee', 'Zero-Waste Origami Cargo Pant'],
    comboSavingsUSD: 65
  },
  {
    id: 'litus-combo-03',
    name: 'Urban Armor Synergy Trio',
    category: 'combos',
    price: 435,
    originalPrice: 520,
    description: 'The complete minimalist streetwear kit. Heavyweight 300GSM organic tee, Cordura modular tactical pouch with titanium ring, and the CNC-machined Lotus titanium cuff.',
    details: [
      'Includes 1x Archive 300GSM Tee + 1x Tactical Pouch & Ring + 1x Lotus Titanium Cuff',
      'Full lifestyle synergy: apparel, utility luggage, and aerospace jewelry',
      'Save $85 on bundle investment',
      'Includes registered NFT asset for titanium cuff on Polygon'
    ],
    fabric: '300GSM Organic Cotton, Ballistic Cordura 500D & Aerospace Grade 5 Titanium',
    sustainabilityNote: 'Lifetime repair and circular take-back guarantee',
    image: '/src/assets/images/litus_minimal_accessory_1792166678035.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Stealth Obsidian', hex: '#0a0e17' },
      { name: 'Glacier Blue Synergy', hex: '#38bdf8' }
    ],
    isRecommended: true,
    isNFTReady: true,
    isNewRelease: true,
    badge: 'Trio Bundle · Save $85',
    comboItems: ['Archive 300GSM Heavyweight Tee', 'Modular Tactical Pouch & Ring', 'Lotus Sculptural Titanium Cuff'],
    comboSavingsUSD: 85
  },
  {
    id: 'litus-combo-04',
    name: 'Monolith Weather Armor Capsule',
    category: 'combos',
    price: 675,
    originalPrice: 755,
    description: 'Ultimate protective weather capsule combining our 3-layer laminated Monolith Storm Shell Parka with the Architectural Pleated Trousers for extreme weather shielding.',
    details: [
      'Includes 1x Monolith Storm Shell Parka + 1x Architectural Pleated Trousers',
      '20,000mm hydrostatic waterproof rating with bonded laser seams',
      'Save $80 on high-performance outerwear set',
      'Priority express atelier dispatch and lifetime waterproofing refresh'
    ],
    fabric: '3-Layer Bio-Based Membrane, Recycled Polyamide & Mulesing-Free Traceable Wool',
    sustainabilityNote: 'PFC-free bio-membrane and 100% microplastic filtered',
    image: '/src/assets/images/litus_technical_overshirt_1792166677796.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Deep Cobalt & Charcoal', hex: '#1d4ed8' },
      { name: 'Dark Slate Monolith', hex: '#0f172a' }
    ],
    isRecommended: true,
    isNFTReady: true,
    badge: 'Capsule · Save $80',
    comboItems: ['Monolith Storm Shell Parka', 'Architectural Pleated Trousers'],
    comboSavingsUSD: 80
  }
];
