import { ImageCatalog } from "@/ui/catalogs/image.catalog";
import { NpcBattleOpponentHelper } from "@/ui/presenters/helper/npc-battle-opponent.helper";
import type { DropSourceViewModel } from "@/ui/viewmodels/drop/drop-source.viewmodel";
import type { WikiDroppedBySourceViewModel } from "@/ui/viewmodels/wiki-modal/wiki-dropped-by-source.viewmodel";

export class WikiDroppedBySourceConverter {
  public static convert(dropSource: DropSourceViewModel): WikiDroppedBySourceViewModel {
    const iconUrl =
      dropSource.kind === "enemy"
        ? ImageCatalog.getEnemyImageUrl(dropSource.label ?? "")
        : NpcBattleOpponentHelper.getImageUrl(dropSource.sourceId);

    return {
      kind: dropSource.kind,
      sourceId: dropSource.sourceId,
      labelKey: dropSource.labelKey,
      label: dropSource.label,
      iconUrl,
      locationId: dropSource.locationId,
      ownerNameKey: dropSource.ownerNameKey,
    };
  }
}
