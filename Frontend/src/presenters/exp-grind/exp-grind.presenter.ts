import { MapId } from "@/constants/map-id.constant";
import { StoryNpcDigimonBattleId } from "@/constants/npc-battle.constant";
import type { State } from "@/models/state";
import { EnemyRepository } from "@/repositories/enemy.repository";
import { MapRepository } from "@/repositories/map.repository";
import { TamerRepository } from "@/repositories/tamer.repository";
import { NpcRepository } from "@/repositories/npc.repository";
import { ImageCatalog } from "@/catalogs/image.catalog";
import { LocationEncounterHelper } from "@/presenters/helper/location-encounter.helper";
import { SeabedMapPresenter } from "@/presenters/map/seabed-map.presenter";
import { MobiusDesertMapPresenter } from "@/presenters/map/mobius-desert-map.presenter";
import { MapService } from "@/services/map.service";
import { QuestService } from "@/services/quest.service";
import { NpcService } from "@/services/npc.service";
import { PartyService } from "@/services/party.service";
import type {
  ExpCharacterBattleViewModel,
  ExpCharacterPartyMemberViewModel,
  ExpEncounterSpot,
  ExpEnemyViewModel,
  ExpGrindMapViewModel,
} from "@/viewmodels/exp-grind/exp-grind.viewmodel";

export class ExpGrindPresenter {
  public static getViewModel(
    gameState: State,
    visitedMapIds: string[] = [],
  ): ExpGrindMapViewModel {
    let currentLocationId = gameState.player.mapId;
    if (
      currentLocationId === MapId.digimonBattle ||
      currentLocationId === MapId.cardBattle
    ) {
      currentLocationId = gameState.player.previousMapId || currentLocationId;
    }

    const lastCompletedMainQuestStep = QuestService.getLastCompletedMainQuestStep(
      gameState.journal.mainQuest,
    );

    const hasFishingPole =
      gameState.importantItems.fishingPole ||
      LocationEncounterHelper.resolveFishingIds("021D", gameState.journal.sideQuests).length > 0;

    const hasTreeBoots =
      gameState.importantItems.treeBoots ||
      LocationEncounterHelper.resolveKickingTreeIds("021D", gameState.journal.sideQuests).length > 0;

    // 1. Current Map Wild Enemies (No bosses)
    const currentMapEnemies = this.resolveCurrentMapEnemies(
      currentLocationId,
      gameState,
    );

    // 2. Visited Maps Wild Enemies (No bosses)
    const allVisitedIds = [
      ...new Set([currentLocationId, ...visitedMapIds]),
    ].filter((id) => {
      return (
        id &&
        id.length > 0 &&
        id !== MapId.digimonBattle &&
        id !== MapId.cardBattle &&
        !id.startsWith("0C")
      );
    });

    const visitedMapsEnemies = this.resolveEnemiesForMaps(
      allVisitedIds,
      lastCompletedMainQuestStep,
      hasFishingPole,
      hasTreeBoots,
    );

    const partyCharisma = PartyService.getCharisma(gameState.party);

    const { characterBattles, upcomingCharacterBattles } = this.resolveCharacterBattles(
      gameState,
      new Set(allVisitedIds),
      currentLocationId,
      partyCharisma,
      lastCompletedMainQuestStep,
    );

    const { availableBosses, upcomingBosses } = this.resolveBossEnemies(
      new Set(allVisitedIds),
      currentLocationId,
      lastCompletedMainQuestStep,
    );

    return {
      locationId: gameState.player.mapId,
      effectiveLocationId: currentLocationId,
      isSafeZone: currentMapEnemies.length === 0,
      currentMapEnemies,
      visitedMapsEnemies,
      visitedMapsCount: allVisitedIds.length,
      availableBosses,
      upcomingBosses,
      characterBattles,
      upcomingCharacterBattles,
      partyCharisma,
    };
  }

  private static resolveCurrentMapEnemies(
    locationId: string,
    gameState: State,
  ): ExpEnemyViewModel[] {
    const mapRaw = MapRepository.getMapById(locationId);
    const region = mapRaw.region ?? "asukaServer";

    const originsByEnemyId = new Map<
      string,
      {
        walking: boolean;
        fishing: boolean;
        kickingTree: boolean;
        boss: boolean;
        spots: ExpEncounterSpot[];
      }
    >();

    const register = (
      id: string,
      type: "walking" | "fishing" | "kickingTree" | "seabed",
    ) => {
      const existing = originsByEnemyId.get(id) ?? {
        walking: false,
        fishing: false,
        kickingTree: false,
        boss: false,
        spots: [],
      };
      if (type === "walking" || type === "seabed") existing.walking = true;
      if (type === "fishing") existing.fishing = true;
      if (type === "kickingTree") existing.kickingTree = true;
      existing.spots.push({ mapId: locationId, source: type });
      originsByEnemyId.set(id, existing);
    };

    if (region === "seabed") {
      const seabedEnemies = SeabedMapPresenter.getEnemyIds(gameState.player.seabedRoute);
      seabedEnemies.forEach((id: string) => register(id, "seabed"));
    } else if (region === "mobiusDesert") {
      const desertEnemies = MobiusDesertMapPresenter.getEnemyIds(
        locationId,
        gameState.journal.mainQuest,
      );
      desertEnemies.forEach((id: string) => register(id, "walking"));
    } else {
      const walkingEnemies = LocationEncounterHelper.resolveWalkingIds(
        locationId,
        gameState.journal.mainQuest,
        gameState.player.previousMapId,
      );
      walkingEnemies.forEach((id) => register(id, "walking"));

      const fishingEnemies = LocationEncounterHelper.resolveFishingIds(
        locationId,
        gameState.journal.sideQuests,
      );
      fishingEnemies.forEach((id) => register(id, "fishing"));

      const kickingTreeEnemies = LocationEncounterHelper.resolveKickingTreeIds(
        locationId,
        gameState.journal.sideQuests,
      );
      kickingTreeEnemies.forEach((id) => register(id, "kickingTree"));
      // Note: Bosses excluded per user request as they cannot be farmed repeatedly for EXP.
    }

    return this.buildEnemyListFromMap(originsByEnemyId);
  }

  private static resolveEnemiesForMaps(
    mapIds: string[],
    lastCompletedMainQuestStep: number,
    hasFishingPole: boolean,
    hasTreeBoots: boolean,
  ): ExpEnemyViewModel[] {
    const originsByEnemyId = new Map<
      string,
      {
        walking: boolean;
        fishing: boolean;
        kickingTree: boolean;
        boss: boolean;
        spots: ExpEncounterSpot[];
      }
    >();

    const register = (
      enemyId: string,
      mapId: string,
      type: "walking" | "fishing" | "kickingTree" | "seabed",
    ) => {
      const existing = originsByEnemyId.get(enemyId) ?? {
        walking: false,
        fishing: false,
        kickingTree: false,
        boss: false,
        spots: [],
      };
      if (type === "walking" || type === "seabed") existing.walking = true;
      if (type === "fishing") existing.fishing = true;
      if (type === "kickingTree") existing.kickingTree = true;

      // avoid duplicating exact spot
      if (!existing.spots.some((s) => s.mapId === mapId && s.source === type)) {
        existing.spots.push({ mapId, source: type });
      }

      originsByEnemyId.set(enemyId, existing);
    };

    for (const mapId of mapIds) {
      // Walking
      const walking = MapService.getWalkingEnemies(mapId, lastCompletedMainQuestStep);
      walking.forEach((eId) => register(eId, mapId, "walking"));

      // Fishing
      if (hasFishingPole) {
        const fishing = MapService.getFishingEnemies(mapId);
        fishing.forEach((eId) => register(eId, mapId, "fishing"));
      }

      // Tree
      if (hasTreeBoots) {
        const tree = MapService.getKickingTreeEnemies(mapId);
        tree.forEach((eId) => register(eId, mapId, "kickingTree"));
      }

      // Note: Bosses are strictly NOT queried or registered here as requested.
    }

    return this.buildEnemyListFromMap(originsByEnemyId);
  }

  private static buildEnemyListFromMap(
    originsByEnemyId: Map<
      string,
      {
        walking: boolean;
        fishing: boolean;
        kickingTree: boolean;
        boss: boolean;
        spots: ExpEncounterSpot[];
      }
    >,
  ): ExpEnemyViewModel[] {
    const list: ExpEnemyViewModel[] = [];

    for (const [enemyId, originData] of originsByEnemyId.entries()) {
      const raw = EnemyRepository.getEnemyById(enemyId);
      if (!raw) continue;

      // Strictly ignore any boss (Pharaohmon, MasterTyrannomon, leaders, etc.)
      if (raw.boss) continue;

      const exp = raw.exp ?? 0;
      const hp = raw.hp || 1;
      const bits = raw.bits ?? 0;
      const efficiency = hp > 0 ? exp / hp : 0;
      const bitsEfficiency = hp > 0 ? bits / hp : 0;

      list.push({
        enemyId,
        name: raw.name,
        imageUrl: ImageCatalog.getEnemyImageUrl(raw.name),
        level: raw.level,
        hp: raw.hp,
        exp,
        dvexp: raw.dvexp ?? 0,
        bits,
        efficiency,
        efficiencyDisplay: efficiency.toFixed(2),
        bitsEfficiency,
        bitsEfficiencyDisplay: bitsEfficiency.toFixed(2),
        origin: {
          walking: originData.walking,
          fishing: originData.fishing,
          kickingTree: originData.kickingTree,
          boss: false,
        },
        isBoss: false,
        locations: raw.locations?.map((l) => l.id),
        encounterSpots: originData.spots,
      });
    }

    // Default sort by EXP descending
    list.sort((a, b) => b.exp - a.exp);
    return list;
  }

  private static resolveCharacterBattles(
    gameState: State,
    visitedMapIdSet: Set<string>,
    currentMapId: string,
    partyCharisma: number,
    lastCompletedMainQuestStep: number,
  ): {
    characterBattles: ExpCharacterBattleViewModel[];
    upcomingCharacterBattles: ExpCharacterBattleViewModel[];
  } {
    const importantItems = gameState.importantItems;
    const npcs = gameState.npcs;
    const characterBattles: ExpCharacterBattleViewModel[] = [];
    const upcomingCharacterBattles: ExpCharacterBattleViewModel[] = [];

    // 1. Tamers (Digimon Battles & Card Battles)
    const tamerTable = TamerRepository.getTamerTable();
    for (const [tamerId, tamerRaw] of Object.entries(tamerTable)) {
      const journalNpc = npcs[tamerId as keyof typeof npcs];

      // A. Digimon Battles
      if (tamerRaw.digimonBattles) {
        for (const [battleId, battleRaw] of Object.entries(tamerRaw.digimonBattles)) {
          const won = NpcService.isDigimonBattleCompleted(journalNpc, battleId);
          if (won) continue;

          // If second battle and first battle was not won yet, player must beat first battle first
          const isSecondGated =
            battleId === "second" &&
            !NpcService.isDigimonBattleCompleted(journalNpc, "first");

          const min = battleRaw.charismaRequired?.min ?? 0;
          const max = battleRaw.charismaRequired?.max;
          const trophyReq = battleRaw.trophyRequired;
          const trophyMet = NpcService.isTrophyRequirementMet(trophyReq, importantItems);

          // Build party members
          const party: ExpCharacterPartyMemberViewModel[] = [];
          let totalHp = 0;
          for (const member of battleRaw.party ?? []) {
            const enemyRaw = EnemyRepository.getEnemyByMemoryIdAndGroupId(
              member.enemyId,
              member.groupId ?? 0,
            );
            if (enemyRaw) {
              const hp = enemyRaw.hp || 0;
              totalHp += hp;
              party.push({
                enemyId: member.enemyId,
                name: enemyRaw.name,
                level: enemyRaw.level,
                hp,
                imageUrl: ImageCatalog.getEnemyImageUrl(enemyRaw.name),
              });
            }
          }

          const exp = battleRaw.exp ?? 0;
          const bits = battleRaw.bit ?? 0;
          const dvexp = battleRaw.dvexp ?? 0;
          const safeHp = totalHp > 0 ? totalHp : 1;
          const efficiency = exp / safeHp;
          const bitsEfficiency = bits / safeHp;
          const charismaRangeText =
            max !== undefined ? `${min}~${max}` : `${min}+`;

          const missingCharisma = Math.max(0, min - partyCharisma);
          const exceededCharisma = max !== undefined ? Math.max(0, partyCharisma - max) : 0;

          const item: ExpCharacterBattleViewModel = {
            characterId: tamerId,
            nameKey: `tamers.${tamerId}.name`,
            source: "tamer",
            type: "tamer",
            imageUrl: ImageCatalog.getTamerImageUrl(tamerRaw.imageName ?? null),
            locationId: tamerRaw.locationId,
            battleId,
            battleKind: "digimon",
            tierNumber: battleId === "second" ? 2 : 1,
            status: "available",
            exp,
            dvexp,
            bits,
            totalHp,
            efficiency,
            efficiencyDisplay: efficiency.toFixed(2),
            bitsEfficiency,
            bitsEfficiencyDisplay: bitsEfficiency.toFixed(2),
            party,
            charismaMin: min,
            charismaMax: max,
            charismaRangeText,
            missingCharisma,
            exceededCharisma,
            trophyRequired: trophyReq,
            trophyMet,
            isInCurrentMap: tamerRaw.locationId === currentMapId,
            isVisitedMap: visitedMapIdSet.has(tamerRaw.locationId),
          };

          if (partyCharisma < min) {
            item.status = "missingCharisma";
            upcomingCharacterBattles.push(item);
          } else if (isSecondGated || !trophyMet) {
            item.status = "missingTrophy";
            upcomingCharacterBattles.push(item);
          } else if (max !== undefined && partyCharisma > max) {
            item.status = "charismaExceeded";
            characterBattles.push(item);
          } else {
            item.status = "available";
            characterBattles.push(item);
          }
        }
      }

      // B. Card Battles
      if (tamerRaw.cardBattles) {
        for (const [battleId, cardRaw] of Object.entries(tamerRaw.cardBattles)) {
          const min = cardRaw.charismaRequired?.min ?? 0;
          const max = cardRaw.charismaRequired?.max;
          const trophyReq = cardRaw.trophyRequired;
          const trophyMet = NpcService.isTrophyRequirementMet(trophyReq, importantItems);

          const charismaRangeText =
            max !== undefined ? `${min}~${max}` : `${min}+`;
          const missingCharisma = Math.max(0, min - partyCharisma);
          const exceededCharisma = max !== undefined ? Math.max(0, partyCharisma - max) : 0;

          const item: ExpCharacterBattleViewModel = {
            characterId: tamerId,
            nameKey: `tamers.${tamerId}.name`,
            source: "tamer",
            type: "tamer",
            imageUrl: ImageCatalog.getTamerImageUrl(tamerRaw.imageName ?? null),
            locationId: tamerRaw.locationId,
            battleId,
            battleKind: "card",
            tierNumber: battleId === "second" ? 2 : 1,
            status: "available",
            exp: 0,
            dvexp: 0,
            bits: 0,
            totalHp: 0,
            efficiency: 0,
            efficiencyDisplay: "0.00",
            bitsEfficiency: 0,
            bitsEfficiencyDisplay: "0.00",
            party: [],
            boosterId: cardRaw.boosterId,
            folderId: cardRaw.folderId,
            charismaMin: min,
            charismaMax: max,
            charismaRangeText,
            missingCharisma,
            exceededCharisma,
            trophyRequired: trophyReq,
            trophyMet,
            isInCurrentMap: tamerRaw.locationId === currentMapId,
            isVisitedMap: visitedMapIdSet.has(tamerRaw.locationId),
          };

          if (partyCharisma < min) {
            item.status = "missingCharisma";
            upcomingCharacterBattles.push(item);
          } else if (!trophyMet) {
            item.status = "missingTrophy";
            upcomingCharacterBattles.push(item);
          } else if (max !== undefined && partyCharisma > max) {
            item.status = "charismaExceeded";
            characterBattles.push(item);
          } else {
            item.status = "available";
            characterBattles.push(item);
          }
        }
      }
    }

    // 2. Story NPCs with battles (Leaders, Troopers, etc.)
    const npcTable = NpcRepository.getNpcTable();
    for (const [npcId, npcRaw] of Object.entries(npcTable)) {
      if (!npcRaw.party || npcRaw.exp === undefined) continue;

      const journalNpc = npcs[npcId as keyof typeof npcs];
      const won = NpcService.isDigimonBattleCompleted(journalNpc, StoryNpcDigimonBattleId);
      if (won) continue;

      const inQuestWindow = QuestService.isOnMainQuestRange(
        lastCompletedMainQuestStep,
        npcRaw.mainQuestAvailabilityWindow,
      );

      const party: ExpCharacterPartyMemberViewModel[] = [];
      let totalHp = 0;
      for (const member of npcRaw.party) {
        const enemyRaw = EnemyRepository.getEnemyByMemoryIdAndGroupId(
          member.enemyId,
          member.groupId ?? 0,
        );
        if (enemyRaw) {
          const hp = enemyRaw.hp || 0;
          totalHp += hp;
          party.push({
            enemyId: member.enemyId,
            name: enemyRaw.name,
            level: enemyRaw.level,
            hp,
            imageUrl: ImageCatalog.getEnemyImageUrl(enemyRaw.name),
          });
        }
      }

      const exp = npcRaw.exp ?? 0;
      const bits = npcRaw.bit ?? 0;
      const dvexp = npcRaw.dvexp ?? 0;
      const safeHp = totalHp > 0 ? totalHp : 1;
      const efficiency = exp / safeHp;
      const bitsEfficiency = bits / safeHp;

      const item: ExpCharacterBattleViewModel = {
        characterId: npcId,
        nameKey: `npcs.${npcId}.name`,
        source: "npc",
        type: npcRaw.type ?? "npc",
        imageUrl: ImageCatalog.getNpcImageUrl(npcRaw.imageName ?? null),
        locationId: npcRaw.locationId,
        battleId: StoryNpcDigimonBattleId,
        battleKind: "digimon",
        tierNumber: 1,
        status: inQuestWindow ? "available" : "missingTrophy",
        exp,
        dvexp,
        bits,
        totalHp,
        efficiency,
        efficiencyDisplay: efficiency.toFixed(2),
        bitsEfficiency,
        bitsEfficiencyDisplay: bitsEfficiency.toFixed(2),
        party,
        charismaMin: 0,
        charismaRangeText: "0+",
        missingCharisma: 0,
        exceededCharisma: 0,
        trophyMet: inQuestWindow,
        isInCurrentMap: npcRaw.locationId === currentMapId,
        isVisitedMap: visitedMapIdSet.has(npcRaw.locationId),
      };

      if (inQuestWindow) {
        characterBattles.push(item);
      } else if (
        npcRaw.mainQuestAvailabilityWindow?.starts &&
        lastCompletedMainQuestStep < npcRaw.mainQuestAvailabilityWindow.starts
      ) {
        upcomingCharacterBattles.push(item);
      }
    }

    // Default sorts:
    // characterBattles: by EXP descending
    characterBattles.sort((a, b) => b.exp - a.exp);

    // upcomingCharacterBattles: "ordenada por carisma de menor para maior"
    upcomingCharacterBattles.sort((a, b) => {
      if (a.charismaMin !== b.charismaMin) {
        return a.charismaMin - b.charismaMin;
      }
      return b.exp - a.exp;
    });

    return { characterBattles, upcomingCharacterBattles };
  }

  private static resolveBossEnemies(
    visitedMapIdSet: Set<string>,
    currentMapId: string,
    lastCompletedMainQuestStep: number,
  ): {
    availableBosses: ExpEnemyViewModel[];
    upcomingBosses: ExpEnemyViewModel[];
  } {
    const availableBosses: ExpEnemyViewModel[] = [];
    const upcomingBosses: ExpEnemyViewModel[] = [];

    const bossIds = ["1", "2", "21", "20", "16", "14", "15"];
    for (const enemyId of bossIds) {
      const raw = EnemyRepository.getEnemyById(enemyId);
      if (!raw) continue;

      const locEntry = raw.locations?.[0];
      const mapId = locEntry?.id ?? "";
      const window = locEntry?.mainQuestAvailabilityWindow;

      const hp = raw.hp || 1;
      const exp = raw.exp || 0;
      const bits = raw.bits || 0;
      const dvexp = raw.dvexp || 0;
      const efficiency = exp / hp;
      const bitsEfficiency = bits / hp;

      const isAvailable = QuestService.isOnMainQuestRange(
        lastCompletedMainQuestStep,
        window,
      );

      const isUpcoming =
        window?.starts !== undefined &&
        lastCompletedMainQuestStep < window.starts;

      const item: ExpEnemyViewModel = {
        enemyId,
        name: raw.name,
        imageUrl: ImageCatalog.getEnemyImageUrl(raw.name),
        level: raw.level,
        hp: raw.hp,
        exp,
        dvexp,
        bits,
        efficiency,
        efficiencyDisplay: efficiency.toFixed(2),
        bitsEfficiency,
        bitsEfficiencyDisplay: bitsEfficiency.toFixed(2),
        origin: {
          walking: false,
          fishing: false,
          kickingTree: false,
          boss: true,
        },
        isBoss: true,
        locations: mapId ? [mapId] : [],
        encounterSpots: mapId ? [{ mapId, source: "boss" }] : [],
        mainQuestAvailabilityWindow: window,
        isAvailable,
      };

      if (isAvailable) {
        availableBosses.push(item);
      } else if (isUpcoming) {
        upcomingBosses.push(item);
      }
    }

    availableBosses.sort((a, b) => b.exp - a.exp);

    upcomingBosses.sort((a, b) => {
      const startA = a.mainQuestAvailabilityWindow?.starts ?? 0;
      const startB = b.mainQuestAvailabilityWindow?.starts ?? 0;
      if (startA !== startB) {
        return startA - startB;
      }
      return a.level - b.level;
    });

    return { availableBosses, upcomingBosses };
  }
}
