import { describe, expect, it } from "vitest";
import type { QuestAddressesRaw } from "@/memory/addresses/journals/quest.addresses";
import { QuestAddressesConverter } from "@/memory/converters/journals/quest-addresses.converter";

describe("QuestAddressesConverter", () => {
  describe("convert", () => {
    it("should convert ids, addresses, bit masks and nested requisites", () => {
      const raw: QuestAddressesRaw = {
        Id: "fishingPole",
        Requisites: [{ Id: "folderBag", Address: "0x00048F42" }],
        Steps: [
          { Number: 1, Address: "0x04B3B0", BitMasks: ["0x02", "0x04"] },
          {
            Number: 2,
            Address: "0x048DB5",
            BitMasks: [],
            Requisites: [{ Id: "spiderWeb", Address: "0x048E09", BitMasks: ["0x01"] }],
          },
        ],
      };

      expect(QuestAddressesConverter.convert(raw)).toEqual({
        id: "fishingPole",
        requisites: [{ id: "folderBag", address: 0x48f42, bitMasks: [] }],
        steps: [
          { number: 1, address: 0x4b3b0, bitMasks: [0x02, 0x04], requisites: [] },
          {
            number: 2,
            address: 0x48db5,
            bitMasks: [],
            requisites: [{ id: "spiderWeb", address: 0x48e09, bitMasks: [0x01] }],
          },
        ],
      });
    });

    it("should default missing lists to empty lists", () => {
      const raw: QuestAddressesRaw = {
        Id: "mainQuest",
        Steps: [{ Number: 1, Address: "0x0004B3B6" }],
      };

      expect(QuestAddressesConverter.convert(raw)).toEqual({
        id: "mainQuest",
        requisites: [],
        steps: [{ number: 1, address: 0x4b3b6, bitMasks: [], requisites: [] }],
      });
    });

    it("should return no steps when steps are missing", () => {
      expect(QuestAddressesConverter.convert({ Id: "emptyQuest" }).steps).toEqual([]);
    });

    it("should throw when the quest id is empty", () => {
      expect(() => QuestAddressesConverter.convert({ Id: "" })).toThrow("Invalid id");
    });

    it("should throw when a requisite id is missing", () => {
      const raw = {
        Id: "fishingPole",
        Requisites: [{ Address: "0x00048F42" }],
      } as unknown as QuestAddressesRaw;

      expect(() => QuestAddressesConverter.convert(raw)).toThrow("Invalid id");
    });

    it("should throw when a step address is invalid", () => {
      const raw: QuestAddressesRaw = {
        Id: "fishingPole",
        Steps: [{ Number: 1, Address: "0xZZ" }],
      };

      expect(() => QuestAddressesConverter.convert(raw)).toThrow("Invalid address value");
    });
  });
});
