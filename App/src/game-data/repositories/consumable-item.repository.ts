import ConsumableItemJson from "@/data/consumable-item.json";
import type { ConsumableItemTable } from "@/game-data/repositories/tables/consumable-item/consumable-item.table";
import type { ConsumableItemRaw } from "@/game-data/repositories/tables/raws/consumable-item/consumable-item.raw";

export class ConsumableItemRepository {
  private static readonly consumableItemTable = ConsumableItemJson as ConsumableItemTable;

  public static getIds(): string[] {
    return Object.keys(this.consumableItemTable);
  }

  public static getById(consumableItemId: number): ConsumableItemRaw | undefined {
    return this.consumableItemTable[String(consumableItemId)];
  }
}
