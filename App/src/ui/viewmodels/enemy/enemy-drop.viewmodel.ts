import type { DropType } from "@/game-data/repositories/tables/raws/drop/drop-type";

export interface EnemyDropViewModel {
  dropId: number;
  type: DropType;
  locationOnly?: string;
}
