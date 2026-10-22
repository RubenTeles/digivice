import { describe, expect, it } from "vitest";
import type { State } from "@/models";
import { StateComposer } from "@/memory/state.composer";
import { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";
import { SnapshotFixtureLoader } from "../helpers/snapshot-fixture.loader";

describe("StateComposer", () => {
  describe("compose", () => {
    it("should compose the migrated entities when the snapshot is the Central Park fixture", () => {
      const snapshot = new MemorySnapshot(SnapshotFixtureLoader.load("field-central-park"));

      const state = StateComposer.compose(snapshot);

      expect(state).toEqual({
        player: {
          bits: 42206,
          mapId: "021D",
          previousMapId: "1000",
          seabedRoute: null,
          mapVariant: null,
        },
      });
    });
  });

  describe("pick", () => {
    it("should keep only the migrated entities when the state is complete", () => {
      const player = {
        bits: 1,
        mapId: "021D",
        previousMapId: "1000",
        seabedRoute: null,
        mapVariant: null,
      };
      const state = { player, party: { slots: [] } } as unknown as State;

      const composedState = StateComposer.pick(state);

      expect(composedState).toEqual({ player });
      expect(composedState.player).toBe(player);
    });
  });
});
