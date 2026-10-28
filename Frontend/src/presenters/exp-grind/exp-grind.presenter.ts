import { MapId } from "@/constants/map-id.constant";
import { StoryNpcDigimonBattleId } from "@/constants/npc-battle.constant";
import type { State } from "@/models/state";
import type { Journal } from "@/models/journal/journal";
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
      gameState.journal,
    );

    const dnaEnemies = this.resolveDnaEnemies(gameState);

    return {
      locationId: gameState.player.mapId,
      effectiveLocationId: currentLocationId,
      isSafeZone: currentMapEnemies.length === 0,
      currentMapEnemies,
      visitedMapsEnemies,
      visitedMapsCount: allVisitedIds.length,
      availableBosses,
      upcomingBosses,
      dnaEnemies,
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

  private static isBossDefeated(
    enemyId: string,
    journal: Journal,
    lastCompletedMainQuestStep: number,
  ): boolean {
    if (enemyId === "1") {
      // Pharaohmon -> eternally
      const quest = journal.legendaryWeapons.find((q) => q.id === "eternally");
      return quest?.steps.some((s) => s.number === 1 && s.isDone) ?? false;
    }
    if (enemyId === "2") {
      // MasterTyrannomon -> invincible
      const quest = journal.legendaryWeapons.find((q) => q.id === "invincible");
      return quest?.steps.some((s) => s.number === 1 && s.isDone) ?? false;
    }
    if (enemyId === "20") {
      // Zanbamon -> muramasa
      const quest = journal.legendaryWeapons.find((q) => q.id === "muramasa");
      return quest?.steps.some((s) => s.number === 1 && s.isDone) ?? false;
    }
    if (enemyId === "16") {
      // Datamon -> superNova
      const quest = journal.legendaryWeapons.find((q) => q.id === "superNova");
      return quest?.steps.some((s) => s.number === 1 && s.isDone) ?? false;
    }
    if (enemyId === "14") {
      // HiAndromon -> punishment
      const quest = journal.legendaryWeapons.find((q) => q.id === "punishment");
      return quest?.steps.some((s) => s.number === 1 && s.isDone) ?? false;
    }
    if (enemyId === "21") {
      // Bulbmon (Bulk Bridge)
      return lastCompletedMainQuestStep >= 14;
    }
    if (enemyId === "15") {
      // WaruMonzaemon (Dum Dum Factory Secret Room)
      return lastCompletedMainQuestStep >= 61;
    }
    return false;
  }

  private static resolveBossEnemies(
    visitedMapIdSet: Set<string>,
    currentMapId: string,
    lastCompletedMainQuestStep: number,
    journal: Journal,
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

      const isDefeated = this.isBossDefeated(
        enemyId,
        journal,
        lastCompletedMainQuestStep,
      );

      const isAvailable = QuestService.isOnMainQuestRange(
        lastCompletedMainQuestStep,
        window,
      );

      const isUpcoming =
        !isDefeated &&
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
        isDefeated,
        status: isDefeated ? "defeated" : (isAvailable ? "available" : "locked"),
        locations: mapId ? [mapId] : [],
        encounterSpots: mapId ? [{ mapId, source: "boss" }] : [],
        mainQuestAvailabilityWindow: window,
        isAvailable,
      };

      if (isAvailable || isDefeated) {
        availableBosses.push(item);
      } else if (isUpcoming) {
        upcomingBosses.push(item);
      }
    }

    // Sort available bosses: alive bosses first by EXP, then defeated bosses by EXP
    availableBosses.sort((a, b) => {
      if (a.isDefeated !== b.isDefeated) {
        return a.isDefeated ? 1 : -1;
      }
      return b.exp - a.exp;
    });

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

  private static resolveDnaEnemies(gameState: State): ExpEnemyViewModel[] {
    const partyLevel = PartyService.getLevel(gameState.party);
    const lastCompletedMainQuestStep = QuestService.getLastCompletedMainQuestStep(
      gameState.journal.mainQuest,
    );

    const dnaDefs = [
      {
        id: "dna-paildramon",
        enemyId: "dna-paildramon",
        questId: "driAgentVeemon",
        name: "Paildramon",
        partnerName: "Veemon",
        driAgentName: "DRI Matthew",
        level: 30,
        hp: 1000,
        exp: 250,
        bits: 500,
        dvexp: 30,
        locationId: "022D", // Ponte Bulk
        levelMin: 1,
        levelMax: 30,
        leaderRequisite: "byakkoLeader" as const,
      },
      {
        id: "dna-metalgreymon",
        enemyId: "dna-metalgreymon",
        questId: "driAgentAgumon",
        name: "MetalGreymon",
        partnerName: "Agumon",
        driAgentName: "DRI Johann",
        level: 35,
        hp: 1200,
        exp: 300,
        bits: 600,
        dvexp: 35,
        locationId: "0233", // Pântano Bulk
        levelMin: 30,
        levelMax: 45,
        leaderRequisite: "seiryuLeader" as const,
      },
      {
        id: "dna-wargrowlmon",
        enemyId: "dna-wargrowlmon",
        questId: "driAgentGuilmon",
        name: "WarGrowlmon",
        partnerName: "Guilmon",
        driAgentName: "DRI Jimmy",
        level: 35,
        hp: 1250,
        exp: 320,
        bits: 640,
        dvexp: 35,
        locationId: "023C", // Selva Sepultura
        levelMin: 30,
        levelMax: 45,
        leaderRequisite: "seiryuLeader" as const,
      },
      {
        id: "dna-magnaangemon",
        enemyId: "dna-magnaangemon",
        questId: "driAgentPatamon",
        name: "MagnaAngemon",
        partnerName: "Patamon",
        driAgentName: "DRI Bob",
        level: 45,
        hp: 1600,
        exp: 420,
        bits: 840,
        dvexp: 45,
        locationId: "0239", // Terra Erma Sul
        levelMin: 45,
        levelMax: 60,
      },
      {
        id: "dna-taomon",
        enemyId: "dna-taomon",
        questId: "driAgentRenamon",
        name: "Taomon",
        partnerName: "Renamon",
        driAgentName: "DRI Taion",
        level: 45,
        hp: 1550,
        exp: 410,
        bits: 820,
        dvexp: 45,
        locationId: "024E", // Terra Erma Norte O
        levelMin: 45,
        levelMax: 60,
      },
      {
        id: "dna-kyukimon",
        enemyId: "dna-kyukimon",
        questId: "driAgentKotemon",
        name: "Kyukimon",
        partnerName: "Kotemon",
        driAgentName: "DRI Ken",
        level: 55,
        hp: 2000,
        exp: 520,
        bits: 1040,
        dvexp: 55,
        locationId: "023F", // Lago Subterrâneo Suzaku
        levelMin: 60,
        levelMax: 90,
      },
      {
        id: "dna-grapleomon",
        enemyId: "dna-grapleomon",
        questId: "driAgentKumamon",
        name: "GrapLeomon",
        partnerName: "Kumamon",
        driAgentName: "DRI Claster",
        level: 55,
        hp: 2100,
        exp: 540,
        bits: 1080,
        dvexp: 55,
        locationId: "0241", // Selva Éter
        levelMin: 60,
        levelMax: 90,
      },
      {
        id: "dna-armormon",
        enemyId: "dna-armormon",
        questId: "driAgentMonmon",
        name: "Armormon",
        partnerName: "Monmon",
        driAgentName: "DRI Mike",
        level: 55,
        hp: 2050,
        exp: 530,
        bits: 1060,
        dvexp: 55,
        locationId: "025C", // Ilha do Duelo
        levelMin: 60,
        levelMax: 90,
      },
    ];

    const result: ExpEnemyViewModel[] = [];

    for (const def of dnaDefs) {
      const quest = gameState.journal.driAgents.find((q) => q.id === def.questId);
      const step2Done = quest?.steps.some((s) => s.number === 2 && s.isDone) ?? false;
      const step3Done = quest?.steps.some((s) => s.number === 3 && s.isDone) ?? false;
      const isDefeated = step2Done || step3Done;

      const levelSatisfied = partyLevel >= def.levelMin && partyLevel <= def.levelMax;
      let leaderSatisfied = true;
      if (def.leaderRequisite === "seiryuLeader") {
        const reqDone = quest?.requisites.find((r) => r.id === "seiryuLeader")?.isDone ?? false;
        leaderSatisfied = reqDone || lastCompletedMainQuestStep >= 2;
      } else if (def.leaderRequisite === "byakkoLeader") {
        const reqDone = quest?.requisites.find((r) => r.id === "byakkoLeader")?.isDone ?? false;
        leaderSatisfied = reqDone || lastCompletedMainQuestStep >= 48;
      }

      const isAvailable = !isDefeated && levelSatisfied && leaderSatisfied;
      const status: "available" | "defeated" | "locked" = isDefeated
        ? "defeated"
        : (isAvailable ? "available" : "locked");

      const efficiency = def.exp / def.hp;
      const bitsEfficiency = def.bits / def.hp;

      result.push({
        enemyId: def.enemyId,
        name: def.name,
        imageUrl: ImageCatalog.getDriAgentEnemyImageUrl(def.name),
        level: def.level,
        hp: def.hp,
        exp: def.exp,
        dvexp: def.dvexp,
        bits: def.bits,
        efficiency,
        efficiencyDisplay: efficiency.toFixed(2),
        bitsEfficiency,
        bitsEfficiencyDisplay: bitsEfficiency.toFixed(2),
        origin: {
          walking: false,
          fishing: false,
          kickingTree: false,
          boss: false,
          dna: true,
        },
        isBoss: false,
        isDna: true,
        isDefeated,
        dnaPartner: def.partnerName,
        driAgentName: def.driAgentName,
        partyLevelRange: { min: def.levelMin, max: def.levelMax },
        status,
        locations: [def.locationId],
        encounterSpots: [{ mapId: def.locationId, source: "dna" }],
        isAvailable,
      });
    }

    result.sort((a, b) => {
      const order = { available: 0, locked: 1, defeated: 2 };
      const statusA = a.status ? order[a.status] : 1;
      const statusB = b.status ? order[b.status] : 1;
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      return a.level - b.level;
    });

    return result;
  }
}
