import { describe, expect, it } from "vitest";
import { StateComparator } from "@/memory/comparison/state.comparator";

describe("StateComparator", () => {
  describe("compare", () => {
    it("should return no divergences when both values are deeply equal", () => {
      const expected = { player: { mapId: "021D", seabedRoute: null }, slots: [1, 2, 3] };
      const actual = { player: { mapId: "021D", seabedRoute: null }, slots: [1, 2, 3] };

      expect(StateComparator.compare(expected, actual, "state")).toEqual([]);
    });

    it("should report the path when a primitive differs", () => {
      const divergences = StateComparator.compare(
        { player: { mapId: "020A" } },
        { player: { mapId: "020B" } },
        "state",
      );

      expect(divergences).toEqual([
        { path: "state.player.mapId", expected: "020A", actual: "020B" },
      ]);
    });

    it("should report the whole value when one side is null", () => {
      const player = { mapId: "021D" };

      expect(StateComparator.compare({ player }, null, "state")).toEqual([
        { path: "state", expected: { player }, actual: null },
      ]);
      expect(StateComparator.compare(null, { player }, "state")).toEqual([
        { path: "state", expected: null, actual: { player } },
      ]);
    });

    it("should report null against a primitive", () => {
      expect(StateComparator.compare({ seabedRoute: null }, { seabedRoute: 0 }, "player")).toEqual([
        { path: "player.seabedRoute", expected: null, actual: 0 },
      ]);
    });

    it("should report missing keys on either side", () => {
      const divergences = StateComparator.compare({ a: 1 }, { b: 2 }, "root");

      expect(divergences).toEqual([
        { path: "root.a", expected: 1, actual: undefined },
        { path: "root.b", expected: undefined, actual: 2 },
      ]);
    });

    it("should report the length and the shared items when list sizes differ", () => {
      const divergences = StateComparator.compare([1, 2, 3], [1, 5], "slots");

      expect(divergences).toEqual([
        { path: "slots.length", expected: 3, actual: 2 },
        { path: "slots[1]", expected: 2, actual: 5 },
      ]);
    });

    it("should report nested paths inside lists of objects", () => {
      const divergences = StateComparator.compare(
        { slots: [{ digimon: { hp: { current: 120 } } }] },
        { slots: [{ digimon: { hp: { current: 118 } } }] },
        "party",
      );

      expect(divergences).toEqual([
        { path: "party.slots[0].digimon.hp.current", expected: 120, actual: 118 },
      ]);
    });

    it("should report a list against an object", () => {
      expect(StateComparator.compare([], {}, "value")).toEqual([
        { path: "value", expected: [], actual: {} },
      ]);
    });
  });
});
