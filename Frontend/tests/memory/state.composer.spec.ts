import { describe, expect, it } from "vitest";
import type { State } from "@/models";
import { StateComposer } from "@/memory/state.composer";
import { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";
import { BattleAgainstNatsumiExpected } from "../fixtures/snapshots/battle-against-natsumi.expected";
import { FieldCentralParkExpected } from "../fixtures/snapshots/field-central-park.expected";
import { SnapshotFixtureLoader } from "../helpers/snapshot-fixture.loader";

describe("StateComposer", () => {
  describe("compose", () => {
    it("should compose the migrated entities when the snapshot is the Central Park fixture", () => {
      const snapshot = new MemorySnapshot(SnapshotFixtureLoader.load("field-central-park"));

      const state = StateComposer.compose(snapshot);

      expect(state).toEqual(FieldCentralParkExpected);
    });

    it("should compose the battle state when the snapshot is the battle against Natsumi fixture", () => {
      const snapshot = new MemorySnapshot(SnapshotFixtureLoader.load("battle-against-natsumi"));

      const state = StateComposer.compose(snapshot);

      expect(state.party).toEqual(BattleAgainstNatsumiExpected.party);
      expect(state.digimonBattle).toEqual(BattleAgainstNatsumiExpected.digimonBattle);
      expect(state.journal).toEqual(BattleAgainstNatsumiExpected.journal);
    });
  });

  describe("pick", () => {
    it("should keep only the migrated entities when the state has extra properties", () => {
      const state = { ...FieldCentralParkExpected, unknownEntity: {} } as unknown as State;

      const pickedState = StateComposer.pick(state);

      expect(pickedState).toEqual(FieldCentralParkExpected);
      expect(pickedState).not.toHaveProperty("unknownEntity");
      expect(pickedState.player).toBe(FieldCentralParkExpected.player);
      expect(pickedState.party).toBe(FieldCentralParkExpected.party);
    });
  });
});
