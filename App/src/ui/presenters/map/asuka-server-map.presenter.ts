import type { DigimonSlot, ImportantItems, Npc, Npcs, Quest } from "@/state/models";
import { AsukaServerMapConverter } from "@/ui/presenters/converter/asuka-server-map.converter";
import { LocationEncounterHelper } from "@/ui/presenters/helper/location-encounter.helper";
import { NpcBattleOpponentHelper } from "@/ui/presenters/helper/npc-battle-opponent.helper";
import { MapService } from "@/game-data/services/map.service";
import { NpcService } from "@/game-data/services/npc.service";
import { PartyService } from "@/game-data/services/party.service";
import { QuestService } from "@/game-data/services/quest.service";
import type { AsukaServerMapViewModel } from "@/ui/viewmodels/map/asuka-server-map.viewmodel";
import type { MapNpcViewModel } from "@/ui/viewmodels/map/map-npc.viewmodel";

export class AsukaServerMapPresenter {
  private static resolveNpcs(
    locationId: string,
    lastCompletedMainQuestStep: number,
    digimonSlots: DigimonSlot[],
    npcs: Npcs,
    importantItems: ImportantItems,
  ): MapNpcViewModel[] {
    const opponentIds = MapService.getMapOpponentIds(locationId, lastCompletedMainQuestStep);
    const partyCharisma = PartyService.getCharisma({ slots: digimonSlots });

    return opponentIds.flatMap((opponentId) => {
      const opponent = NpcBattleOpponentHelper.resolveById(opponentId);
      const nameKey = NpcBattleOpponentHelper.getNameKey(opponentId);
      if (opponent === undefined || nameKey === null) {
        return [];
      }

      const journalNpc = this.resolveNpc(npcs, opponentId);

      const availableBattleKind = NpcService.getAvailableBattleKindForOpponent(
        opponent,
        journalNpc,
        partyCharisma,
        importantItems,
      );

      return [
        {
          id: opponentId,
          nameKey,
          hasAvailableBattle: availableBattleKind !== null,
          availableBattleKind,
        },
      ];
    });
  }

  private static resolveNpc(npcs: Npcs, npcId: string): Npc | null {
    return npcs[npcId as keyof Npcs] ?? null;
  }

  public static getViewModel(
    locationId: string,
    mainQuest: Quest,
    sideQuests: Quest[],
    digimonSlots: DigimonSlot[],
    previousMapId: string,
    npcs: Npcs,
    importantItems: ImportantItems,
  ): AsukaServerMapViewModel {
    const fishingIds = LocationEncounterHelper.resolveFishingIds(locationId, sideQuests);
    const kickingTreeIds = LocationEncounterHelper.resolveKickingTreeIds(locationId, sideQuests);
    const bossIds = MapService.getBoss(locationId);
    const lastCompletedMainQuestStep = QuestService.getLastCompletedMainQuestStep(mainQuest);
    const mapNpcs = this.resolveNpcs(
      locationId,
      lastCompletedMainQuestStep,
      digimonSlots,
      npcs,
      importantItems,
    );
    const enemyIds = LocationEncounterHelper.resolveWalkingIds(
      locationId,
      mainQuest,
      previousMapId,
    );

    return AsukaServerMapConverter.convert(
      locationId,
      enemyIds,
      bossIds,
      fishingIds,
      kickingTreeIds,
      mapNpcs,
    );
  }
}
