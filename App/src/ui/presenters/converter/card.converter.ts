import type { CardRaw } from "@/game-data/repositories/tables/raws/tcg/card.raw";
import type { CardViewModel } from "@/ui/viewmodels/card/card.viewmodel";

export class CardConverter {
  public static convert(cardId: string, cardRaw: CardRaw): CardViewModel {
    return {
      imageName: cardRaw.imageName,
      nameKey: `card.${cardId}.name`,
      noteKey: `card.${cardId}.note`,
      type: cardRaw.type,
      points: cardRaw.points,
    };
  }
}
