import { StatService } from "@/presentation/services/stat.service";
import type { StatViewModel } from "@/presentation/viewmodels/digimon/stat.viewmodel";

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
