import type { Party, Quest } from "@/state/models";
import { PartyDvexpConverter } from "@/ui/presenters/converter/party-dvexp.converter";
import { DigimonRepository } from "@/game-data/repositories";
import { DvexpService } from "@/game-data/services/dvexp.service";
import { QuestService } from "@/game-data/services/quest.service";
import type { PartyDvexpViewModel } from "@/ui/viewmodels/dvexp/party-dvexp.viewmodel";
import type { EnemyLocationViewModel } from "@/ui/viewmodels/enemy/enemy-location.viewmodel";

export class WikiEnemyResumePresenter {
  public static getAvailableEnemyLocations(
    locations: EnemyLocationViewModel[] | undefined,
    mainQuest: Quest,
  ): EnemyLocationViewModel[] {
    const lastCompletedMainQuestStep = QuestService.getLastCompletedMainQuestStep(mainQuest);
    const resolvedLocations = (locations ?? []).filter((location) => {
      return QuestService.isOnMainQuestRange(
        lastCompletedMainQuestStep,
        location.mainQuestAvailabilityWindow,
      );
    });

    return [...resolvedLocations].sort((first, second) => {
      return first.id.localeCompare(second.id);
    });
  }

  public static getPartyDvexp(party: Party, enemyBaseDvexp: number): PartyDvexpViewModel[] {
    return DvexpService.getPartyBattleGains(party, enemyBaseDvexp).map((gain) => {
      return PartyDvexpConverter.convert(gain, DigimonRepository.getNameById(gain.digimonId));
    });
  }
}
