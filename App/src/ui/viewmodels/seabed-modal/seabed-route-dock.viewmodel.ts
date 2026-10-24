import type { SeabedDirectionDockType } from "@/game-data/repositories/tables/raws/seabed/seabed-direction-dock.raw";
import type { LabelPlacement } from "@/shared/types/label-placement.type";

export interface SeabedDirectionDockViewModel {
  location: string;
  x: number;
  y: number;
  type: SeabedDirectionDockType;
  labelPlacement: LabelPlacement;
}
