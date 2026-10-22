import { describe, expect, it } from "vitest";
import type { DigimonStatusAddressesRaw } from "@/memory/addresses/parties/digimon-status.addresses";
import { DigimonStatusAddressesConverter } from "@/memory/converters/parties/digimon-status-addresses.converter";

function createRaw(): DigimonStatusAddressesRaw {
  return {
    Experience: "0x18",
    Level: "0x1C",
    TP: "0x1E",
    HP: { Current: "0x20", Max: "0x22" },
    MP: { Current: "0x24", Max: "0x26" },
    Attributes: {
      Strength: "0x28",
      Defense: "0x2A",
      Spirit: "0x2C",
      Wisdom: "0x2E",
      Speed: "0x30",
      Charisma: "0x32",
    },
    Elements: {
      Fire: "0x34",
      Water: "0x36",
      Ice: "0x38",
      Wind: "0x3A",
      Thunder: "0x3C",
      Machine: "0x3E",
      Dark: "0x40",
    },
    Equipments: {
      Head: "0x3C0",
      Body: "0x3C2",
      Right: "0x3C4",
      Left: "0x3C6",
      Accessory1: "0x3C8",
      Accessory2: "0x3CA",
    },
    Digievolutions: {
      ActiveDigievolution: "-4",
      Slots: [
        { Index: 1, Address: "0x48" },
        { Index: 2, Address: "0x4A" },
      ],
      UnlockedDigievolutionsStart: "0x50",
      UnlockedDigievolutionEntryStride: "20",
      MaxUnlockedDigievolutions: "60",
      Id: "0x00",
      Level: "0x02",
      Dvexp: "0x04",
    },
  };
}

describe("DigimonStatusAddressesConverter", () => {
  describe("convert", () => {
    it("should convert every offset of the Digimon status", () => {
      expect(DigimonStatusAddressesConverter.convert(createRaw())).toEqual({
        experience: 0x18,
        level: 0x1c,
        tp: 0x1e,
        hp: { current: 0x20, max: 0x22 },
        mp: { current: 0x24, max: 0x26 },
        attributes: {
          strength: 0x28,
          defense: 0x2a,
          spirit: 0x2c,
          wisdom: 0x2e,
          speed: 0x30,
          charisma: 0x32,
        },
        elements: {
          fire: 0x34,
          water: 0x36,
          ice: 0x38,
          wind: 0x3a,
          thunder: 0x3c,
          machine: 0x3e,
          dark: 0x40,
        },
        equipments: {
          head: 0x3c0,
          body: 0x3c2,
          right: 0x3c4,
          left: 0x3c6,
          accessory1: 0x3c8,
          accessory2: 0x3ca,
        },
        digievolutions: {
          activeDigievolution: -4,
          slots: [
            { index: 1, address: 0x48 },
            { index: 2, address: 0x4a },
          ],
          unlockedDigievolutionsStart: 0x50,
          unlockedDigievolutionEntryStride: 20,
          maxUnlockedDigievolutions: 60,
          id: 0,
          level: 2,
          dvexp: 4,
        },
      });
    });

    it("should throw when a scalar offset is missing", () => {
      const raw = createRaw();
      delete (raw.HP as Partial<typeof raw.HP>).Max;

      expect(() => DigimonStatusAddressesConverter.convert(raw)).toThrow("Invalid address value");
    });
  });
});
