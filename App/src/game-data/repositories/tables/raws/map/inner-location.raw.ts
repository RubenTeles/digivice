import type { CoordinatesRaw } from "@/game-data/repositories/tables/raws/quest/coordinates.raw";

export interface InnerLocationRaw {
  location: string;
  coordinates: CoordinatesRaw;
}
