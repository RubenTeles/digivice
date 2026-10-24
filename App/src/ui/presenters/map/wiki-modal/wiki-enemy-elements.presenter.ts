import { EnemyStatConverter } from "@/ui/presenters/converter/enemy-stat.converter";
import type { EnemyViewModel } from "@/ui/viewmodels/enemy/enemy.viewmodel";
import type { EnemyStatViewModel } from "@/ui/viewmodels/enemy/enemy-stat.viewmodel";

export class WikiEnemyElementsPresenter {
  public static getStats(elements: EnemyViewModel["elements"]): EnemyStatViewModel[] {
    return EnemyStatConverter.convertElements(elements);
  }
}
