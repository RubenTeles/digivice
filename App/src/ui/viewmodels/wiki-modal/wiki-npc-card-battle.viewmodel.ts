import type { EnemyDropViewModel } from "@/ui/viewmodels/enemy/enemy-drop.viewmodel";
import type { WikiNpcFolderCardViewModel } from "@/ui/viewmodels/wiki-modal/wiki-npc-folder-card.viewmodel";

export interface WikiNpcCardBattleViewModel {
  nameKey: string;
  level: number;
  cards: WikiNpcFolderCardViewModel[];
  drops: EnemyDropViewModel[];
}
