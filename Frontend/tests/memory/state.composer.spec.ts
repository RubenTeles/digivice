import { describe, expect, it } from "vitest";
import type { State } from "@/models";
import { StateComposer } from "@/memory/state.composer";
import { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";
import { FieldCentralParkExpected } from "../fixtures/snapshots/field-central-park.expected";
import { SnapshotFixtureLoader } from "../helpers/snapshot-fixture.loader";

describe("StateComposer", () => {
  describe("compose", () => {
    it("should compose the migrated entities when the snapshot is the Central Park fixture", () => {
      const snapshot = new MemorySnapshot(SnapshotFixtureLoader.load("field-central-park"));

      const state = StateComposer.compose(snapshot);

      expect(state).toEqual(FieldCentralParkExpected);
    });
  });

  describe("pick", () => {
    it("should keep only the migrated entities when the state is complete", () => {
      const state = { ...FieldCentralParkExpected, party: { slots: [] } } as unknown as State;

      const pickedState = StateComposer.pick(state);

      expect(pickedState).toEqual(FieldCentralParkExpected);
      expect(pickedState).not.toHaveProperty("party");
      expect(pickedState.player).toBe(FieldCentralParkExpected.player);
      expect(pickedState.npcs).toBe(FieldCentralParkExpected.npcs);
    });
  });
});
