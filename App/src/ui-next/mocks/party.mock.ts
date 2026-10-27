import type { Vital } from "@/state/models";

export type PartyDigievolutionMock = {
  digievolutionId: number;
  level: number;
  dvexpInLevel: number;
  dvexpPerLevel: number;
  isDnaActive: boolean;
};

export type PartyDigievolutionSlotMock = PartyDigievolutionMock | null;

export type PartyDigimonMock = {
  digimonId: number;
  name: string;
  level: number;
  experience: number;
  hp: Vital;
  mp: Vital;
  tp: number;
  blast: number;
  digievolutions: PartyDigievolutionSlotMock[];
  activeDigievolutionId: number | null;
};

export type PartySlotMock = PartyDigimonMock | null;

const DigievolutionsMock: PartyDigievolutionSlotMock[] = [
  { digievolutionId: 260, level: 61, dvexpInLevel: 2, dvexpPerLevel: 10, isDnaActive: true },
  { digievolutionId: 381, level: 1, dvexpInLevel: 5, dvexpPerLevel: 10, isDnaActive: true },
  null,
];

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
    digievolutions: DigievolutionsMock,
    activeDigievolutionId: 381,
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
    digievolutions: DigievolutionsMock,
    activeDigievolutionId: 381,
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
    digievolutions: DigievolutionsMock,
    activeDigievolutionId: 381,
  },
];
