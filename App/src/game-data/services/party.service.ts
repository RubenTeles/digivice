import type { Party } from "@/state/models";
import { EquipmentRepository } from "@/game-data/repositories/equipment.repository";
import { EquipmentService } from "@/game-data/services/equipment.service";
import { StatService } from "@/game-data/services/stat.service";

export class PartyService {
  public static getLevel(party: Party): number {
    const digimons = party.slots.map((slot) => slot.digimon).filter((digimon) => digimon !== null);

    return Math.sum(
      digimons.map((digimon) => {
        return digimon.level;
      }),
    );
  }

  public static getCharisma(party: Party): number {
    const digimons = party.slots.map((slot) => slot.digimon).filter((digimon) => digimon !== null);

    return Math.sum(
      digimons.map((digimon) => {
        const equipmentIds = EquipmentService.getEquipmentIds(digimon.equipments);
        const equipmentsRaws = EquipmentRepository.getEquipmentsByIds(equipmentIds);
        const charismaBonus = EquipmentService.calculateBonus("charisma", equipmentsRaws);

        return StatService.calculateStat(digimon.attributes.charisma, charismaBonus);
      }),
    );
  }
}
