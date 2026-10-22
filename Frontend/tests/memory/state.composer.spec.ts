import { describe, expect, it } from "vitest";
import type { State } from "@/models";
import { StateComposer, type ComposedState } from "@/memory/state.composer";
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
        importantItems: {
          treeBoots: true,
          fishingPole: true,
          asukaTrophy: false,
          sunTrophy: false,
        },
        auctions: {
          divineBarrier: true,
          hazardShield: true,
          sniperShield: false,
          dramonShield: true,
          yinYangWand: false,
          hazardFang: false,
        },
        cardBattle: { id: null },
      });
    });
  });

  describe("pick", () => {
    it("should keep only the migrated entities when the state is complete", () => {
      const composedState: ComposedState = {
        player: {
          bits: 1,
          mapId: "021D",
          previousMapId: "1000",
          seabedRoute: null,
          mapVariant: null,
        },
        importantItems: {
          treeBoots: true,
          fishingPole: false,
          asukaTrophy: false,
          sunTrophy: false,
        },
        auctions: {
          divineBarrier: false,
          hazardShield: false,
          sniperShield: false,
          dramonShield: false,
          yinYangWand: false,
          hazardFang: false,
        },
        cardBattle: { id: 7 },
      };
      const state = { ...composedState, party: { slots: [] } } as unknown as State;

      const pickedState = StateComposer.pick(state);

      expect(pickedState).toEqual(composedState);
      expect(pickedState.player).toBe(composedState.player);
      expect(pickedState.cardBattle).toBe(composedState.cardBattle);
    });
  });
});
