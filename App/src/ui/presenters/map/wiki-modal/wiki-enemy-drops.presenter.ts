import { WikiEnemyDropConverter } from "@/ui/presenters/converter/wiki-enemy-drop.converter";
import { DropService } from "@/game-data/services/drop.service";
import type { EnemyDropViewModel } from "@/ui/viewmodels/enemy/enemy-drop.viewmodel";
import type { WikiEnemyDropViewModel } from "@/ui/viewmodels/wiki-modal/wiki-enemy-drop.viewmodel";

export class WikiEnemyDropsPresenter {
  public static getViewModel(drops?: EnemyDropViewModel[]): WikiEnemyDropViewModel[] {
    return (drops ?? []).map((drop) => {
      return WikiEnemyDropConverter.convert(
        drop,
        DropService.getDropTranslationKeyById(drop.dropId, drop.type),
      );
    });
  }
}
