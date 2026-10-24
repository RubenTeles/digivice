import { StatService } from "@/game-data/services/stat.service";
import type { StatViewModel } from "@/ui/viewmodels/digimon/stat.viewmodel";

export class StatConverter {
  public static convert(
    fromDigimon: number,
    fromEquipaments: number,
    fromDigievolution: number,
  ): StatViewModel {
    return {
      fromDigimon,
      fromEquipaments,
      fromDigievolution,
      sumBetweenDigimonAndEquipaments: StatService.calculateStat(fromDigimon, fromEquipaments),
    };
  }
}
