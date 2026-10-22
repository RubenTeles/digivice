import type { State } from "@/models";
import { PlayerProvider } from "@/memory/providers/player.provider";
import type { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";

// Grows one entity per migration step until it becomes the full State.
export type ComposedState = Pick<State, "player">;

export class StateComposer {
  public static compose(snapshot: MemorySnapshot): ComposedState {
    return {
      player: PlayerProvider.get(snapshot),
    };
  }

  public static pick(state: State): ComposedState {
    return {
      player: state.player,
    };
  }
}
