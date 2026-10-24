import { ConsumableItemConverter } from "@/ui/presenters/converter/consumable-item.converter";
import { ConsumableItemRepository } from "@/game-data/repositories/consumable-item.repository";
import type { ConsumableItemViewModel } from "@/ui/viewmodels/consumable-item/consumable-item.viewmodel";

export class WikiDropConsumableItemPresenter {
  public static getViewModel(consumableItemId: number): ConsumableItemViewModel | null {
    const consumableItemRaw = ConsumableItemRepository.getById(consumableItemId);
    if (consumableItemRaw === undefined) {
      return null;
    }

    return ConsumableItemConverter.convert(consumableItemId, consumableItemRaw);
  }
}
