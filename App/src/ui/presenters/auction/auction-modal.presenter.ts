import type { Auctions, Quest } from "@/state/models";
import { AuctionService } from "@/game-data/services/auction.service";
import type { AuctionViewModel } from "@/ui/viewmodels/auction/auction.viewmodel";

export class AuctionModalPresenter {
  public static getAuctions(auctions: Auctions, mainQuest: Quest): AuctionViewModel[] {
    return AuctionService.getAuctions(auctions, mainQuest);
  }
}
