import type { AuctionStatus } from "@/shared/types/auction-status.type";
import type { AuctionRaw } from "@/game-data/repositories/tables/raws/auction/auction.raw";
import type { AuctionViewModel } from "@/ui/viewmodels/auction/auction.viewmodel";

export class AuctionConverter {
  public static convert(auctionRaw: AuctionRaw, status: AuctionStatus): AuctionViewModel {
    return {
      id: auctionRaw.id,
      equipmentId: Number(auctionRaw.equipmentId),
      status,
      bid: auctionRaw.bid,
      resale: auctionRaw.resale,
    };
  }
}
