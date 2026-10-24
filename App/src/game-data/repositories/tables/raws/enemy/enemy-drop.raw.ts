import type { DropType } from "@/game-data/repositories/tables/raws/drop/drop-type";

export interface EnemyDropRaw {
  dropId: number;
  type: DropType;
  locationOnly?: string;
}
