import { EquipmentConverter } from "@/ui/presenters/converter/equipment.converter";
import { DigimonRepository } from "@/game-data/repositories/digimon.repository";
import { EquipmentRepository } from "@/game-data/repositories/equipment.repository";
import type { EquipmentViewModel } from "@/ui/viewmodels/digimon/equipment.viewmodel";

export class WikiDropEquipmentPresenter {
  public static getViewModel(equipmentId: number): EquipmentViewModel {
    const equipmentRaw = EquipmentRepository.getEquipmentById(equipmentId);
    const equipableDigimonNames = equipmentRaw.equipableDigimon.map((digimonId) => {
      return DigimonRepository.getNameById(Number(digimonId));
    });
    return EquipmentConverter.convert(equipmentId, equipableDigimonNames, equipmentRaw);
  }
}
