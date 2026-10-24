import type { EquipmentSlot } from "@/shared/types/equipment-slot.type";
import type { EquipmentViewModel } from "@/ui/viewmodels/digimon/equipment.viewmodel";

export interface EquipmentSlotViewModel {
  slotKey: EquipmentSlot;
  equipment: EquipmentViewModel | null;
}
