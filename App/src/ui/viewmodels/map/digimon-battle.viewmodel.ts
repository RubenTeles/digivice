import type { Vital } from "@/state/models";
import type { EnemyAffinitiesViewModel } from "@/ui/viewmodels/enemy/enemy-affinities.viewmodel";
import type { EnemyConditionViewModel } from "@/ui/viewmodels/enemy/enemy-condition.viewmodel";
import type { EnemyStatViewModel } from "@/ui/viewmodels/enemy/enemy-stat.viewmodel";

export interface DigimonBattleViewModel {
  enemyId: string | null;
  enemyName: string;
  isBoss: boolean;
  level: number | null;
  species: string | null;
  speciesEmoji: string | null;
  hp: Vital;
  attributes: EnemyStatViewModel[];
  elements: EnemyStatViewModel[];
  conditions: EnemyConditionViewModel[];
  affinities: EnemyAffinitiesViewModel;
  enemyImageUrl: string | null;
}
