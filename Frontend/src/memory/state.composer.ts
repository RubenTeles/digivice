import type { State } from "@/models";
import { AuctionsProvider } from "@/memory/providers/auctions.provider";
import { CardBattleProvider } from "@/memory/providers/card-battle.provider";
import { ImportantItemsProvider } from "@/memory/providers/important-items.provider";
import { NpcsProvider } from "@/memory/providers/npcs.provider";
import { PlayerProvider } from "@/memory/providers/player.provider";
import type { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";

// Grows one entity per migration step until it becomes the full State.
export type ComposedState = Pick<
  State,
  "player" | "importantItems" | "auctions" | "cardBattle" | "npcs"
>;

export class StateComposer {
  public static compose(snapshot: MemorySnapshot): ComposedState {
    return {
      player: PlayerProvider.get(snapshot),
      importantItems: ImportantItemsProvider.get(snapshot),
      auctions: AuctionsProvider.get(snapshot),
      cardBattle: CardBattleProvider.get(snapshot),
      npcs: NpcsProvider.get(snapshot),
    };
  }

  public static pick(state: State): ComposedState {
    return {
      player: state.player,
      importantItems: state.importantItems,
      auctions: state.auctions,
      cardBattle: state.cardBattle,
      npcs: state.npcs,
    };
  }
}
