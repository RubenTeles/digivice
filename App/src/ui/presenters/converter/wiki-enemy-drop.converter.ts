import type { EnemyDropViewModel } from "@/ui/viewmodels/enemy/enemy-drop.viewmodel";
import type { WikiEnemyDropViewModel } from "@/ui/viewmodels/wiki-modal/wiki-enemy-drop.viewmodel";

export class WikiEnemyDropConverter {
  public static convert(drop: EnemyDropViewModel, labelKey: string): WikiEnemyDropViewModel {
    return {
      dropId: drop.dropId,
      type: drop.type,
      labelKey,
      locationOnly: drop.locationOnly,
    };
  }
}
