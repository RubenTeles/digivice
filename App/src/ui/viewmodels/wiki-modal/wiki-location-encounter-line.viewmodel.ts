import type { EnemySource } from "@/shared/types/enemy-source.type";
import type { WikiLocationEncounterEnemyViewModel } from "@/ui/viewmodels/wiki-modal/wiki-location-encounter-enemy.viewmodel";

export interface WikiLocationEncounterLineViewModel {
  source: EnemySource;
  enemies: WikiLocationEncounterEnemyViewModel[];
}
