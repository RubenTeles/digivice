export interface SectorDefinition {
  id: "eastSector" | "southSector" | "westSector" | "northSector";
  nameKey: string;
  requiredMainQuestStep: number;
  mapIds: string[];
  seabedRoutes: string[];
}

export const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: "eastSector",
    nameKey: "map.0001",
    requiredMainQuestStep: 0,
    mapIds: [
      "021B", // Asuka Sewers
      "021C", // Control Room
      "021D", // Central Park
      "021E", // Wire Forest Entrance
      "021F", // Shell Beach
      "0220", // Plug Cape
      "0221", // West Wire Forest
      "0222", // East Wire Forest
      "0225", // Protocol Forest
      "0226", // Protocol Ruins
      "0227", // Divermons Lake
      "0229", // Wind Prairie
      "022A", // Kicking Forest
      "022B", // Tyranno Valley
      "022D", // Deeper Crevice
    ],
    seabedRoutes: ["1", "2", "3"],
  },
  {
    id: "southSector",
    nameKey: "map.0002",
    requiredMainQuestStep: 15,
    mapIds: [
      "0247", // South Badland
      "0233", // Bulk Swamp
      "0234", // Bulk Bridge
      "0235", // Bios Swamp
      "0237", // Tranquil Swamp
      "023A", // Jungle Grave
      "023B", // Phoenix Bay
      "023C", // Ether Jungle
      "023D", // South Cape
      "0241", // Suzaku UG Lake
      "0242", // Jungle Shrine
      "0243", // Catacomb
    ],
    seabedRoutes: ["4", "7"],
  },
  {
    id: "westSector",
    nameKey: "map.0003",
    requiredMainQuestStep: 44,
    mapIds: [
      "0248", // Noise Desert
      "0249", // Pelche Oasis
      "024A", // North Badland W
      "024B", // North Badland E
      "024C", // Bullet Valley
      "024D", // Dum Dum Factory
      "024E", // Duct Room
      "024F", // Duct Room
      "0250", // Duct Room
      "0251", // Duct Room
      "0252", // Operation Room
      "0253", // Secret Stairs
      "0254", // Sewers
      "0257", // Noise Desert S
      "0258", // Mobius Desert
      "0259", // Mobius Desert 2
      "025A", // Mirage Tower
    ],
    seabedRoutes: ["8", "9"],
  },
  {
    id: "northSector",
    nameKey: "map.0004",
    requiredMainQuestStep: 62,
    mapIds: [],
    seabedRoutes: [],
  },
];
