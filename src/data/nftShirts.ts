export interface NFTShirt {
  id: string;
  tokenId: string;
  name: string;
  subtitle: string;
  category: 'shirt';
  priceSOL: number;
  priceUSD: number;
  edition: string;
  totalMinted: number;
  maxSupply: number;
  rarity: 'Genesis' | 'Mythic' | 'Ultra Rare' | 'Rare';
  image: string;
  physicalGarmentLinked: string;
  contractAddress: string;
  blockchain: string;
  tokenStandard: 'ERC-721' | 'Solana Metaplex';
  description: string;
  traits: { trait_type: string; value: string }[];
  metaverseReady: boolean;
}

export const NFT_SHIRTS_COLLECTION: NFTShirt[] = [
  {
    id: 'nft-shirt-001',
    tokenId: '#001',
    name: 'Architectura Holographic Cyber-Overshirt',
    subtitle: 'Genesis Digital Twin // SS26',
    category: 'shirt',
    priceSOL: 1.25,
    priceUSD: 210,
    edition: 'Genesis First Mint',
    totalMinted: 14,
    maxSupply: 25,
    rarity: 'Genesis',
    image: '/src/assets/images/litus_nft_digital_fashion_1792166656272.jpg',
    physicalGarmentLinked: 'Includes SS26 Atelier Technical Overshirt in Midnight Marine',
    contractAddress: '0xLITUS_GENESIS_7a9c8f01b9e2',
    blockchain: 'Ethereum ZK-Rollup / Solana',
    tokenStandard: 'ERC-721',
    description: 'The flagship digital couture garment of the LITUS Web3 Atelier. Features iridescent neon wireframe shaders, real-time lighting reactivity, and embedded physical NFC pairing.',
    traits: [
      { trait_type: 'Silhouette', value: 'Architectural Boxy Cut' },
      { trait_type: 'Material Twin', value: 'Econyl Regenerated Nylon' },
      { trait_type: 'Emission Layer', value: 'Electric Cyan Bioluminescence' },
      { trait_type: 'AR Wearable', value: 'Unreal Engine & Spatial Ready' },
      { trait_type: 'Atelier Royalties', value: '5% Perpetual Holder Yield' }
    ],
    metaverseReady: true,
  },
  {
    id: 'nft-shirt-002',
    tokenId: '#002',
    name: 'Bioluminescent Lotus Boxy Shirt',
    subtitle: 'Botanical Luminescence Edition',
    category: 'shirt',
    priceSOL: 0.85,
    priceUSD: 145,
    edition: 'Seasonal Drop',
    totalMinted: 28,
    maxSupply: 50,
    rarity: 'Rare',
    image: '/src/assets/images/litus_lotus_sustainability_1792166656259.jpg',
    physicalGarmentLinked: 'Includes Bioluminescent Lotus Boxy Cotton Shirt',
    contractAddress: '0xLITUS_LOTUS_3e44c219ba48',
    blockchain: 'Ethereum ZK-Rollup',
    tokenStandard: 'ERC-721',
    description: 'Dynamic digital wearable that shifts luminescence based on the solar coordinates of the owner. Embedded with poetic lotus leaf animations.',
    traits: [
      { trait_type: 'Silhouette', value: 'Oversized Drop Shoulder' },
      { trait_type: 'Material Twin', value: '100% GOTS Aegean Cotton' },
      { trait_type: 'Botanical Phase', value: 'Aquatic Bloom' },
      { trait_type: 'AR Wearable', value: 'Decentraland & Sandbox .GLB' }
    ],
    metaverseReady: true,
  },
  {
    id: 'nft-shirt-003',
    tokenId: '#003',
    name: 'Midnight Marine Technical Zip Overshirt',
    subtitle: 'Zero-Waste Pattern Archive',
    category: 'shirt',
    priceSOL: 1.45,
    priceUSD: 240,
    edition: 'Ultra Rare Archive',
    totalMinted: 8,
    maxSupply: 20,
    rarity: 'Ultra Rare',
    image: '/src/assets/images/litus_technical_overshirt_1792166677796.jpg',
    physicalGarmentLinked: 'Includes Bespoke Tailored Japanese Poplin Overshirt',
    contractAddress: '0xLITUS_ARCHIVE_99fb014c2b9a',
    blockchain: 'Ethereum ZK-Rollup',
    tokenStandard: 'ERC-721',
    description: 'Precision digital twin featuring waterproof laser-cut seam mapping and magnetic hardware rigging for avatar physics.',
    traits: [
      { trait_type: 'Silhouette', value: 'Utility Workshirt' },
      { trait_type: 'Hardware', value: 'Matte Titanium Zipper Rig' },
      { trait_type: 'Seam Tech', value: 'Ultrasonic Bonded' },
      { trait_type: 'Atelier Access', value: 'Milan Fashion Week VIP Invite' }
    ],
    metaverseReady: true,
  },
  {
    id: 'nft-shirt-004',
    tokenId: '#004',
    name: 'Studio Minimalist Heavyweight Archive Shirt',
    subtitle: 'Monochrome Heritage Edition',
    category: 'shirt',
    priceSOL: 0.70,
    priceUSD: 115,
    edition: 'Core Collection',
    totalMinted: 62,
    maxSupply: 100,
    rarity: 'Rare',
    image: '/src/assets/images/litus_oversized_tee_1792166677289.jpg',
    physicalGarmentLinked: 'Includes 300GSM Heavyweight Ring-Spun Studio Shirt',
    contractAddress: '0xLITUS_CORE_8712ab04c99e',
    blockchain: 'Solana',
    tokenStandard: 'Solana Metaplex',
    description: 'The foundational digital shirt of the LITUS collective. Backed by guaranteed physical buyback warranty and on-chain carbon offset retirement.',
    traits: [
      { trait_type: 'Silhouette', value: 'Relaxed Studio Fit' },
      { trait_type: 'Fabric Weight', value: '300 GSM Heavyweight' },
      { trait_type: 'Carbon Offset', value: '25kg CO2 Retired' }
    ],
    metaverseReady: true,
  },
  {
    id: 'nft-shirt-005',
    tokenId: '#005',
    name: 'Monolith Storm Shell Couture Shirt-Jacket',
    subtitle: 'Apex Weather Armor NFT',
    category: 'shirt',
    priceSOL: 2.50,
    priceUSD: 420,
    edition: 'Mythic Atelier Run',
    totalMinted: 3,
    maxSupply: 10,
    rarity: 'Mythic',
    image: '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
    physicalGarmentLinked: 'Includes Flagship 3-Layer Bio-Membrane Storm Parka Shirt',
    contractAddress: '0xLITUS_MYTHIC_001fe89ca214',
    blockchain: 'Ethereum ZK-Rollup',
    tokenStandard: 'ERC-721',
    description: 'Apex physical-digital luxury asset. Grants direct voting power in future LITUS collection fabric governance and lifetime complimentary atelier repairs.',
    traits: [
      { trait_type: 'Silhouette', value: 'Sculptural Asymmetric Shell' },
      { trait_type: 'Waterproof Rating', value: '20,000mm Hydrostatic' },
      { trait_type: 'Governance Weight', value: '100 Atelier DAO Votes' },
      { trait_type: 'Metaverse Physics', value: 'Dynamic Wind & Fluid FX' }
    ],
    metaverseReady: true,
  }
];
