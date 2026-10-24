import type { DropType } from "@/game-data/repositories/tables/raws/drop/drop-type";

export interface WikiEnemyDropViewModel {
  dropId: number;
  type: DropType;
  labelKey: string;
  locationOnly?: string;
}
