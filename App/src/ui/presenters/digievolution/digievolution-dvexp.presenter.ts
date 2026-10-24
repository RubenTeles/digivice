import {
  DvexpBarSegments,
  DvexpThresholdLevelByTier,
  MaxDigievolutionLevel,
  RegularDvexpPerLevel,
  ThresholdDvexpPerLevel,
} from "@/shared/constants/digievolution.constant";
import { DigievolutionRepository } from "@/game-data/repositories/digievolution.repository";

export class DigievolutionDvexpPresenter {
  public static getFilledSegments(digievolutionId: number, level: number, dvexp: number): number {
    if (level >= MaxDigievolutionLevel) {
      return DvexpBarSegments;
    }

    const tier = DigievolutionRepository.getTierById(digievolutionId);
    const thresholdLevel = DvexpThresholdLevelByTier[tier];

    if (level < thresholdLevel) {
      return dvexp % RegularDvexpPerLevel;
    }

    const thresholdDvexp = (thresholdLevel - 1) * RegularDvexpPerLevel;
    const dvexpInsideLevel = (dvexp - thresholdDvexp) % ThresholdDvexpPerLevel;
    const dvexpPerSegment = ThresholdDvexpPerLevel / DvexpBarSegments;

    return Math.floor(dvexpInsideLevel / dvexpPerSegment);
  }
}
