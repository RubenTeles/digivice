import { CardConverter } from "@/ui/presenters/converter/card.converter";
import { BoosterRepository } from "@/game-data/repositories/booster.repository";
import { CardRepository } from "@/game-data/repositories/card.repository";
import { CardShopRepository } from "@/game-data/repositories/card-shop.repository";
import type { WikiCardPanelViewModel } from "@/ui/viewmodels/wiki-modal/wiki-card-panel.viewmodel";

export class WikiCardPanelPresenter {
  public static getViewModel(cardId: string): WikiCardPanelViewModel | null {
    const cardRaw = CardRepository.getCardById(cardId);
    if (cardRaw === undefined) {
      return null;
    }

    return {
      card: CardConverter.convert(cardId, cardRaw),
      boosters: BoosterRepository.getBoosterIdsByCardId(Number(cardId)),
      cardShops: CardShopRepository.getCardShopsByCardId(cardId).map((cardShopCardRaw) => ({
        id: cardShopCardRaw.cardShopId,
        mainQuestAvailabilityWindow: cardShopCardRaw.mainQuestAvailabilityWindow,
      })),
    };
  }
}
