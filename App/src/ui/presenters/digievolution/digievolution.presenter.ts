import { DigievolutionRepository } from "@/game-data/repositories/digievolution.repository";

export class DigievolutionPresenter {
  public static getNameById(digievolutionId: number): string {
    return DigievolutionRepository.getNameById(digievolutionId);
  }
}
