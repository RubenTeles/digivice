export interface ExpEncounterSpot {
  mapId: string;
  source: "walking" | "fishing" | "kickingTree" | "seabed" | "boss" | "dna";
}

export interface ExpEnemyViewModel {
  enemyId: string;
  name: string;
  imageUrl: string | null;
  level: number;
  hp: number;
  exp: number;
  dvexp: number;
  bits: number;
  efficiency: number;
  efficiencyDisplay: string;
  bitsEfficiency: number;
  bitsEfficiencyDisplay: string;
  origin: {
    walking: boolean;
    fishing: boolean;
    kickingTree: boolean;
    boss: boolean;
    seabed?: boolean;
    dna?: boolean;
  };
  isBoss: boolean;
  isDna?: boolean;
  isDefeated?: boolean;
  dnaPartner?: string;
  driAgentName?: string;
  partyLevelRange?: {
    min: number;
    max: number;
  };
  status?: "available" | "defeated" | "locked";
  locations?: string[];
  encounterSpots?: ExpEncounterSpot[];
  mainQuestAvailabilityWindow?: {
    starts?: number;
    ends?: number;
  };
  isAvailable?: boolean;
}

export type ExpBattleStatus = "available" | "charismaExceeded" | "missingCharisma" | "missingTrophy";

export interface ExpGrindMapViewModel {
  locationId: string;
  effectiveLocationId: string;
  isSafeZone: boolean;
  currentMapEnemies: ExpEnemyViewModel[];
  visitedMapsEnemies: ExpEnemyViewModel[];
  visitedMapsCount: number;
  availableBosses: ExpEnemyViewModel[];
  upcomingBosses: ExpEnemyViewModel[];
  dnaEnemies: ExpEnemyViewModel[];
  characterBattles: ExpCharacterBattleViewModel[];
  upcomingCharacterBattles: ExpCharacterBattleViewModel[];
  partyCharisma: number;
}

export interface ExpCharacterPartyMemberViewModel {
  enemyId: number;
  name: string;
  level: number;
  hp: number;
  imageUrl: string | null;
}

export interface ExpCharacterBattleViewModel {
  characterId: string;
  nameKey: string;
  source: "tamer" | "npc";
  type: "tamer" | "leader" | "npc";
  imageUrl: string | null;
  locationId: string;
  battleId: string;
  battleKind: "digimon" | "card";
  tierNumber: number;
  status: ExpBattleStatus;
  exp: number;
  dvexp: number;
  bits: number;
  totalHp: number;
  efficiency: number;
  efficiencyDisplay: string;
  bitsEfficiency: number;
  bitsEfficiencyDisplay: string;
  party: ExpCharacterPartyMemberViewModel[];
  boosterId?: number;
  folderId?: string;
  charismaMin: number;
  charismaMax?: number;
  charismaRangeText: string;
  missingCharisma: number;
  exceededCharisma: number;
  trophyRequired?: string;
  trophyMet: boolean;
  isInCurrentMap: boolean;
  isVisitedMap: boolean;
}
