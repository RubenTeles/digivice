import type { State } from "@/models";
import { AuctionsProvider } from "@/memory/providers/auctions.provider";
import { CardBattleProvider } from "@/memory/providers/card-battle.provider";
import { DigimonBattleProvider } from "@/memory/providers/digimon-battle.provider";
import { ImportantItemsProvider } from "@/memory/providers/important-items.provider";
import { JournalProvider } from "@/memory/providers/journal.provider";
import { NpcsProvider } from "@/memory/providers/npcs.provider";
import { PartyProvider } from "@/memory/providers/party.provider";
import { PlayerProvider } from "@/memory/providers/player.provider";
import type { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";

// Grows one entity per migration step until it becomes the full State.
export type ComposedState = Pick<
  State,
  | "player"
  | "importantItems"
  | "party"
  | "auctions"
  | "cardBattle"
  | "npcs"
  | "digimonBattle"
  | "journal"
>;

export class StateComposer {
  public static compose(snapshot: MemorySnapshot): ComposedState {
    return {
      player: PlayerProvider.get(snapshot),
      importantItems: ImportantItemsProvider.get(snapshot),
      party: PartyProvider.get(snapshot),
      auctions: AuctionsProvider.get(snapshot),
      cardBattle: CardBattleProvider.get(snapshot),
      npcs: NpcsProvider.get(snapshot),
      digimonBattle: DigimonBattleProvider.get(snapshot),
      journal: JournalProvider.get(snapshot),
    };
  }

  public static pick(state: State): ComposedState {
    return {
      player: state.player,
      importantItems: state.importantItems,
      party: state.party,
      auctions: state.auctions,
      cardBattle: state.cardBattle,
      npcs: state.npcs,
      digimonBattle: state.digimonBattle,
      journal: state.journal,
    };
  }
}
