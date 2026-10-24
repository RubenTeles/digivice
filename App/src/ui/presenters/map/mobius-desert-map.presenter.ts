import type { Quest } from "@/state/models";
import { MapService } from "@/game-data/services/map.service";
import { MobiusDesertService } from "@/game-data/services/mobius-desert.service";
import { QuestService } from "@/game-data/services/quest.service";
import type { DesertAreaMapCellViewModel } from "@/ui/viewmodels/desert/desert-area-map-cell.viewmodel";

export class MobiusDesertMapPresenter {
  public static getEnemyIds(locationId: string, mainQuest: Quest): string[] {
    const walkingIds = MapService.getWalkingEnemies(
      locationId,
      QuestService.getLastCompletedMainQuestStep(mainQuest),
    );
    const bossIds = MapService.getBoss(locationId);

    return [...bossIds, ...walkingIds];
  }

  public static getMobiusDesertArea(
    locationId: string,
    mapVariant: number | null,
  ): DesertAreaMapCellViewModel | null {
    return MobiusDesertService.getMobiusDesertArea(locationId, mapVariant);
  }
}
