import AuctionJson from "@/data/auction.json";
import type { AuctionTable } from "@/game-data/repositories/tables/auction/auction.table";
import type { AuctionRaw } from "@/game-data/repositories/tables/raws/auction/auction.raw";

export class AuctionRepository {
  private static readonly auctionTable = AuctionJson as AuctionTable;

  public static getAuctions(): AuctionRaw[] {
    return this.auctionTable;
  }
}
