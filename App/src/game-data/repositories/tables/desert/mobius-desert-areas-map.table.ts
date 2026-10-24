import type { MobiusDesertAreaMapCellRaw } from "@/game-data/repositories/tables/raws/mobius-desert/mobius-desert-area-map-cell.raw";

export type MobiusDesertAreasMapTable = Record<string, Record<string, MobiusDesertAreaMapCellRaw>>;
