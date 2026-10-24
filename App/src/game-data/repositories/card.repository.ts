import CardJson from "@/data/tcg/card.json";
import type { CardTable } from "@/game-data/repositories/tables/tcg/card.table";
import type { CardRaw } from "@/game-data/repositories/tables/raws/tcg/card.raw";

export class CardRepository {
  private static readonly cardTable = CardJson as CardTable;

  public static getCardById(cardId: string): CardRaw | undefined {
    return this.cardTable[cardId];
  }

  public static getCardTable(): CardTable {
    return this.cardTable;
  }

  public static getCardIds(): string[] {
    return Object.keys(this.cardTable);
  }
}
