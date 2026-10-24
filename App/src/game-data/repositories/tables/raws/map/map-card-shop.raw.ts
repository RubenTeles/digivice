import type { CoordinatesRaw } from "@/game-data/repositories/tables/raws/quest/coordinates.raw";
import type { LabelPlacement } from "@/shared/types/label-placement.type";

export interface MapCardShopRaw {
  id: string;
  coordinates?: CoordinatesRaw;
  labelPlacement?: LabelPlacement;
}
