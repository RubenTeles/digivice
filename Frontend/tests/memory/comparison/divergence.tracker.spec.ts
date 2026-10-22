import { describe, expect, it } from "vitest";
import { DivergenceTracker } from "@/memory/comparison/divergence.tracker";
import type { Divergence } from "@/memory/comparison/state.comparator";

const MapIdDivergence: Divergence = {
  path: "state.player.mapId",
  expected: "020A",
  actual: "020B",
};

const BitsDivergence: Divergence = { path: "state.player.bits", expected: 10, actual: 20 };

describe("DivergenceTracker", () => {
  describe("constructor", () => {
    it.each([0, -1, 1.5])("should throw RangeError when the threshold is %s", (threshold) => {
      expect(() => new DivergenceTracker(threshold)).toThrow(RangeError);
    });
  });

  describe("update", () => {
    it("should report a divergence only when it reaches the threshold", () => {
      const tracker = new DivergenceTracker(3);

      expect(tracker.update([MapIdDivergence]).reported).toEqual([]);
      expect(tracker.update([MapIdDivergence]).reported).toEqual([]);
      expect(tracker.update([MapIdDivergence]).reported).toEqual([MapIdDivergence]);
    });

    it("should report a persistent divergence only once", () => {
      const tracker = new DivergenceTracker(1);

      expect(tracker.update([MapIdDivergence]).reported).toEqual([MapIdDivergence]);
      expect(tracker.update([MapIdDivergence]).reported).toEqual([]);
    });

    it("should restart the count when a divergence disappears before the threshold", () => {
      const tracker = new DivergenceTracker(3);

      tracker.update([MapIdDivergence]);
      tracker.update([MapIdDivergence]);
      const changesAfterGap = tracker.update([]);
      tracker.update([MapIdDivergence]);
      tracker.update([MapIdDivergence]);

      expect(changesAfterGap).toEqual({ reported: [], resolved: [] });
      expect(tracker.update([MapIdDivergence]).reported).toEqual([MapIdDivergence]);
    });

    it("should report the resolution only for divergences that were reported", () => {
      const tracker = new DivergenceTracker(2);

      tracker.update([MapIdDivergence, BitsDivergence]);
      tracker.update([MapIdDivergence]);
      const changes = tracker.update([]);

      expect(changes).toEqual({ reported: [], resolved: ["state.player.mapId"] });
    });

    it("should track each path independently", () => {
      const tracker = new DivergenceTracker(2);

      tracker.update([MapIdDivergence]);
      const changes = tracker.update([MapIdDivergence, BitsDivergence]);

      expect(changes.reported).toEqual([MapIdDivergence]);
      expect(tracker.update([BitsDivergence])).toEqual({
        reported: [BitsDivergence],
        resolved: ["state.player.mapId"],
      });
    });
  });
});
