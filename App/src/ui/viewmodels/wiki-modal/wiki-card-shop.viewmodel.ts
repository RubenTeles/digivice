import type { WikiCardShopInventoryCardViewModel } from "@/ui/viewmodels/wiki-modal/wiki-card-shop-inventory-card.viewmodel";

export interface WikiCardShopViewModel {
  cards: WikiCardShopInventoryCardViewModel[];
  locationId: string | null;
}
