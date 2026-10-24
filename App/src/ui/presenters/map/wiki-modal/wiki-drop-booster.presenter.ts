import { WikiDropBoosterCardConverter } from "@/ui/presenters/converter/wiki-drop-booster-card.converter";
import { BoosterRepository } from "@/game-data/repositories/booster.repository";
import { CardRepository } from "@/game-data/repositories/card.repository";
import type { WikiDropBoosterCardViewModel } from "@/ui/viewmodels/wiki-modal/wiki-drop-booster-card.viewmodel";

export class WikiDropBoosterPresenter {
  public static getViewModel(boosterId: number): WikiDropBoosterCardViewModel[] {
    const cards: WikiDropBoosterCardViewModel[] = [];

    for (const cardId of BoosterRepository.getCardIdsByBoosterId(boosterId)) {
      if (CardRepository.getCardById(String(cardId)) === undefined) {
        continue;
      }

      cards.push(WikiDropBoosterCardConverter.convert(cardId));
    }

    return cards;
  }
}
