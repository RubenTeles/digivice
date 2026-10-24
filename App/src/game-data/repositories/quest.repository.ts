import MainQuestJson from "@/content/database/quest/main-quest.json";
import EternallyJson from "@/content/database/quest/legendary-weapons/eternally.json";
import InvincibleJson from "@/content/database/quest/legendary-weapons/invincible.json";
import MuramasaJson from "@/content/database/quest/legendary-weapons/muramasa.json";
import SuperNovaJson from "@/content/database/quest/legendary-weapons/super-nova.json";
import PunishmentJson from "@/content/database/quest/legendary-weapons/punishment.json";
import DriAgentGuilmonJson from "@/content/database/quest/dri-agents/dri-agent-guilmon.json";
import DriAgentAgumonJson from "@/content/database/quest/dri-agents/dri-agent-agumon.json";
import DriAgentVeemonJson from "@/content/database/quest/dri-agents/dri-agent-veemon.json";
import DriAgentKumamonJson from "@/content/database/quest/dri-agents/dri-agent-kumamon.json";
import DriAgentMonmonJson from "@/content/database/quest/dri-agents/dri-agent-monmon.json";
import DriAgentKotemonJson from "@/content/database/quest/dri-agents/dri-agent-kotemon.json";
import DriAgentRenamonJson from "@/content/database/quest/dri-agents/dri-agent-renamon.json";
import DriAgentPatamonJson from "@/content/database/quest/dri-agents/dri-agent-patamon.json";
import AsukaTrophyJson from "@/content/database/quest/duel-island/asuka-trophy.json";
import AsukaRematchJson from "@/content/database/quest/duel-island/asuka-rematch.json";
import TreeBootsJson from "@/content/database/quest/side-quest/tree-boots.json";
import FishingPoleJson from "@/content/database/quest/side-quest/fishing-pole.json";
import FolderBagJson from "@/content/database/quest/side-quest/folder-bag.json";
import type { MainQuestTable } from "@/game-data/repositories/tables/quest/main-quest.table";
import type { EternallyTable } from "@/game-data/repositories/tables/quest/legendary-weapons/eternally.table";
import type { InvincibleTable } from "@/game-data/repositories/tables/quest/legendary-weapons/invincible.table";
import type { MuramasaTable } from "@/game-data/repositories/tables/quest/legendary-weapons/muramasa.table";
import type { SuperNovaTable } from "@/game-data/repositories/tables/quest/legendary-weapons/super-nova.table";
import type { PunishmentTable } from "@/game-data/repositories/tables/quest/legendary-weapons/punishment.table";
import type { DriAgentGuilmonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-guilmon.table";
import type { DriAgentAgumonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-agumon.table";
import type { DriAgentVeemonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-veemon.table";
import type { DriAgentKumamonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-kumamon.table";
import type { DriAgentMonmonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-monmon.table";
import type { DriAgentKotemonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-kotemon.table";
import type { DriAgentRenamonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-renamon.table";
import type { DriAgentPatamonTable } from "@/game-data/repositories/tables/quest/dri-agents/dri-agent-patamon.table";
import type { AsukaTrophyTable } from "@/game-data/repositories/tables/quest/duel-island/asuka-trophy.table";
import type { AsukaRematchTable } from "@/game-data/repositories/tables/quest/duel-island/asuka-rematch.table";
import type { TreeBootsTable } from "@/game-data/repositories/tables/quest/side-quest/tree-boots.table";
import type { FishingPoleTable } from "@/game-data/repositories/tables/quest/side-quest/fishing-pole.table";
import type { FolderBagTable } from "@/game-data/repositories/tables/quest/side-quest/folder-bag.table";
import type { QuestRaw } from "@/game-data/repositories/tables/raws/quest/quest.raw";

export class QuestRepository {
  private static readonly mainQuestTable = MainQuestJson as MainQuestTable;
  private static readonly eternallyTable = EternallyJson as EternallyTable;
  private static readonly invincibleTable = InvincibleJson as InvincibleTable;
  private static readonly muramasaTable = MuramasaJson as MuramasaTable;
  private static readonly superNovaTable = SuperNovaJson as SuperNovaTable;
  private static readonly punishmentTable = PunishmentJson as PunishmentTable;
  private static readonly driAgentGuilmonTable = DriAgentGuilmonJson as DriAgentGuilmonTable;
  private static readonly driAgentAgumonTable = DriAgentAgumonJson as DriAgentAgumonTable;
  private static readonly driAgentVeemonTable = DriAgentVeemonJson as DriAgentVeemonTable;
  private static readonly driAgentKumamonTable = DriAgentKumamonJson as DriAgentKumamonTable;
  private static readonly driAgentMonmonTable = DriAgentMonmonJson as DriAgentMonmonTable;
  private static readonly driAgentKotemonTable = DriAgentKotemonJson as DriAgentKotemonTable;
  private static readonly driAgentRenamonTable = DriAgentRenamonJson as DriAgentRenamonTable;
  private static readonly driAgentPatamonTable = DriAgentPatamonJson as DriAgentPatamonTable;
  private static readonly asukaTrophyTable = AsukaTrophyJson as AsukaTrophyTable;
  private static readonly asukaRematchTable = AsukaRematchJson as AsukaRematchTable;
  private static readonly treeBootsTable = TreeBootsJson as TreeBootsTable;
  private static readonly fishingPoleTable = FishingPoleJson as FishingPoleTable;
  private static readonly folderBagTable = FolderBagJson as FolderBagTable;

  public static getMainQuestRaw(): QuestRaw {
    return this.mainQuestTable;
  }
  public static getSideQuestsRaw(): QuestRaw[] {
    return [this.folderBagTable, this.fishingPoleTable, this.treeBootsTable];
  }
  public static getLegendaryWeaponsRaw(): QuestRaw[] {
    return [
      this.eternallyTable,
      this.invincibleTable,
      this.muramasaTable,
      this.superNovaTable,
      this.punishmentTable,
    ];
  }
  public static getDriAgentsRaw(): QuestRaw[] {
    return [
      this.driAgentAgumonTable,
      this.driAgentGuilmonTable,
      this.driAgentPatamonTable,
      this.driAgentRenamonTable,
      this.driAgentKotemonTable,
      this.driAgentKumamonTable,
      this.driAgentMonmonTable,
      this.driAgentVeemonTable,
    ];
  }
  public static getDuelIslandRaw(): QuestRaw[] {
    return [this.asukaTrophyTable, this.asukaRematchTable];
  }
}
