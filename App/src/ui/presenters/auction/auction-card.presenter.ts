import type { Auctions, Quest } from "@/state/models";
import { AuctionService } from "@/game-data/services/auction.service";
import type { AuctionViewModel } from "@/ui/viewmodels/auction/auction.viewmodel";

export class AuctionCardPresenter {
  public static getAvailableAuction(auctions: Auctions, mainQuest: Quest): AuctionViewModel | null {
    return AuctionService.getAvailableAuction(auctions, mainQuest);
  }
}
