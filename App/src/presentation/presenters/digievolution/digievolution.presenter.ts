import { DigievolutionRepository } from "@/presentation/repositories/digievolution.repository";
import type { DigievolutionTier } from "@/shared/types/digievolution-tier.type";

export class DigievolutionPresenter {
  public static getNameById(digievolutionId: number): string {
    return DigievolutionRepository.getNameById(digievolutionId);
  }

  public static getTierById(digievolutionId: number): DigievolutionTier {
    return DigievolutionRepository.getTierById(digievolutionId);
  }
}
