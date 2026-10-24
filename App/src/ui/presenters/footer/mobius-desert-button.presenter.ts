import type { Quest } from "@/state/models";
import { MapRepository } from "@/game-data/repositories";
import { MapService } from "@/game-data/services/map.service";
import { QuestService } from "@/game-data/services/quest.service";
import type { LocationViewModel } from "@/ui/viewmodels/location/location.viewmodel";
import { LocationConverter } from "@/ui/presenters/converter/location.converter";

export class MobiusDesertButtonPresenter {
  public static getLocation(locationId: string, mainQuest: Quest): LocationViewModel {
    const locationRaw = MapRepository.getMapById(locationId);
    const walkingIds = MapService.getWalkingEnemies(
      locationId,
      QuestService.getLastCompletedMainQuestStep(mainQuest),
    );
    const bossIds = MapService.getBoss(locationId);
    const enemyIds = [...bossIds, ...walkingIds];

    return LocationConverter.convert(locationId, locationRaw, enemyIds);
  }
}
