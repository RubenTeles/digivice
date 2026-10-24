import type { CardViewModel } from "@/ui/viewmodels/card/card.viewmodel";
import type { CardShopViewModel } from "@/ui/viewmodels/card/card-shop.viewmodel";

export interface WikiCardPanelViewModel {
  card: CardViewModel;
  boosters: number[];
  cardShops: CardShopViewModel[];
}
