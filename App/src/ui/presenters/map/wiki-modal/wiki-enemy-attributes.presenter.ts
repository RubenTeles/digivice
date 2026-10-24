import { EnemyStatConverter } from "@/ui/presenters/converter/enemy-stat.converter";
import type { EnemyViewModel } from "@/ui/viewmodels/enemy/enemy.viewmodel";
import type { EnemyStatViewModel } from "@/ui/viewmodels/enemy/enemy-stat.viewmodel";

export class WikiEnemyAttributesPresenter {
  public static getStats(attributes: EnemyViewModel["attributes"]): EnemyStatViewModel[] {
    return EnemyStatConverter.convertAttributes(attributes);
  }
}
