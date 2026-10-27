import type { Vital } from "@/state/models";

export type PartyDigimonMock = {
  digimonId: number;
  name: string;
  level: number;
  experience: number;
  hp: Vital;
  mp: Vital;
  tp: number;
  blast: number;
};

export type PartySlotMock = PartyDigimonMock | null;

export const PartySlotsMock: PartySlotMock[] = [
  {
    digimonId: 5,
    name: "Guilmon",
    level: 20,
    experience: 6900,
    hp: { current: 180, max: 240 },
    mp: { current: 30, max: 120 },
    tp: 12,
    blast: 850,
  },
  {
    digimonId: 6,
    name: "Renamon",
    level: 18,
    experience: 4550,
    hp: { current: 50, max: 200 },
    mp: { current: 140, max: 160 },
    tp: 5,
    blast: 600,
  },
  {
    digimonId: 1,
    name: "Kumamon",
    level: 15,
    experience: 3800,
    hp: { current: 260, max: 260 },
    mp: { current: 90, max: 110 },
    tp: 0,
    blast: 200,
  },
];
