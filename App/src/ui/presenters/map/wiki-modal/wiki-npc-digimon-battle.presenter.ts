import { ImageCatalog } from "@/ui/catalogs/image.catalog";
import type { Party } from "@/state/models";
import { EnemyConverter } from "@/ui/presenters/converter/enemy.converter";
import { PartyDvexpConverter } from "@/ui/presenters/converter/party-dvexp.converter";
import { NpcBattleOpponentHelper } from "@/ui/presenters/helper/npc-battle-opponent.helper";
import { DigimonRepository } from "@/game-data/repositories";
import { EnemyRepository } from "@/game-data/repositories/enemy.repository";
import type { NpcPartyMemberRaw } from "@/game-data/repositories/tables/raws/npc/npc-party-member.raw";
import { DvexpService } from "@/game-data/services/dvexp.service";
import type { PartyDvexpViewModel } from "@/ui/viewmodels/dvexp/party-dvexp.viewmodel";
import type { WikiNpcDigimonBattleViewModel } from "@/ui/viewmodels/wiki-modal/wiki-npc-digimon-battle.viewmodel";

export class WikiNpcDigimonBattlePresenter {
  public static getPartyDvexp(party: Party, battleBaseDvexp: number): PartyDvexpViewModel[] {
    return DvexpService.getPartyBattleGains(party, battleBaseDvexp).map((gain) => {
      return PartyDvexpConverter.convert(gain, DigimonRepository.getNameById(gain.digimonId));
    });
  }

  private static buildMembers(party: NpcPartyMemberRaw[]) {
    return party.flatMap((partyMember) => {
      const enemyRaw = EnemyRepository.getEnemyByMemoryIdAndGroupId(
        partyMember.enemyId,
        partyMember.groupId,
      );
      if (enemyRaw === null) {
        return [];
      }

      const enemy = EnemyConverter.convert(enemyRaw);

      return [
        {
          id: String(partyMember.enemyId),
          enemy,
          imageUrl: ImageCatalog.getEnemyImageUrl(enemy.name),
        },
      ];
    });
  }

  public static getBattleViewModel(
    npcId: string,
    battleId: string,
  ): WikiNpcDigimonBattleViewModel | null {
    const opponent = NpcBattleOpponentHelper.resolveById(npcId);
    if (opponent === undefined) {
      return null;
    }

    if (opponent.source === "npc") {
      const members = this.buildMembers(opponent.raw.party);

      return {
        exp: opponent.raw.exp,
        dvexp: opponent.raw.dvexp,
        bits: opponent.raw.bit,
        partyMemberCount: members.length,
        members,
      };
    }

    const digimonBattle = opponent.raw.digimonBattles?.[battleId];
    if (digimonBattle === undefined) {
      return null;
    }

    const members = this.buildMembers(digimonBattle.party);

    return {
      exp: digimonBattle.exp,
      dvexp: digimonBattle.dvexp,
      bits: digimonBattle.bit,
      partyMemberCount: members.length,
      members,
    };
  }
}
