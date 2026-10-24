import type { CoordinatesViewModel } from "@/ui/viewmodels/quest/coordinates.viewmodel";
import type { MainQuestAvailabilityWindowViewModel } from "@/ui/viewmodels/quest/main-quest-availability-window.viewmodel";
import type { EnemySource } from "@/shared/types/enemy-source.type";

export interface EnemyLocationViewModel {
  id: string;
  labelKey: string;
  sources: EnemySource[];
  localCoordinates?: CoordinatesViewModel;
  mainQuestAvailabilityWindow?: MainQuestAvailabilityWindowViewModel;
}
