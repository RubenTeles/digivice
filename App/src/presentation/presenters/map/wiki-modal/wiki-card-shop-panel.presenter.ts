import type { Quest } from "@/state/models";
import { CardShopRepository } from "@/presentation/repositories/card-shop.repository";
import type {
  CardShopInventoryItemRaw,
  CardShopPhaseRaw,
} from "@/presentation/repositories/tables/raws/tcg/card-shop.raw";
import { QuestService } from "@/presentation/services/quest.service";
import type { WikiCardShopViewModel } from "@/presentation/viewmodels/wiki-modal/wiki-card-shop.viewmodel";

export class WikiCardShopPanelPresenter {
  public static getViewModel(cardShopId: string, mainQuest: Quest): WikiCardShopViewModel {
    const cardShopRaw = CardShopRepository.getById(cardShopId);
    if (cardShopRaw === undefined) {
      return {
        cards: [],
        locationId: null,
      };
    }

    const lastCompletedMainQuestStep = QuestService.getLastCompletedMainQuestStep(mainQuest);

    return {
      cards: this.getActiveInventory(cardShopRaw.phases, lastCompletedMainQuestStep),
      locationId: cardShopRaw.locationId,
    };
  }

  private static getActiveInventory(
    phases: CardShopPhaseRaw[],
    lastCompletedMainQuestStep: number,
  ): CardShopInventoryItemRaw[] {
    const inventory: CardShopInventoryItemRaw[] = [];

    for (const phase of phases) {
      const isInRange = QuestService.isOnMainQuestRange(
        lastCompletedMainQuestStep,
        phase.mainQuestAvailabilityWindow,
      );
      if (!isInRange) {
        continue;
      }

      inventory.push(...phase.inventory);
    }

    return inventory;
  }
}
