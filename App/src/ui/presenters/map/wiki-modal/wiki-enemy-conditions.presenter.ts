import { EnemyConditionConverter } from "@/ui/presenters/converter/enemy-condition.converter";
import type { EnemyViewModel } from "@/ui/viewmodels/enemy/enemy.viewmodel";
import type { EnemyConditionViewModel } from "@/ui/viewmodels/enemy/enemy-condition.viewmodel";

export class WikiEnemyConditionsPresenter {
  public static getConditions(conditions: EnemyViewModel["conditions"]): EnemyConditionViewModel[] {
    return EnemyConditionConverter.convertConditions(conditions);
  }
}
