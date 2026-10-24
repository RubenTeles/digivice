import type { DigievolutionTechniqueRaw } from "@/game-data/repositories/tables/raws/digievolution/digievolution-technique.raw";
import type { DigievolutionTechniqueViewModel } from "@/ui/viewmodels/digievolution/digievolution-technique.viewmodel";

export class DigievolutionTechniqueConverter {
  public static convert(
    digievolutionTechniqueRaw: DigievolutionTechniqueRaw,
  ): DigievolutionTechniqueViewModel {
    return {
      id: digievolutionTechniqueRaw.id,
      learnAt: digievolutionTechniqueRaw.learnAt,
      loadAt: digievolutionTechniqueRaw.loadAt,
    };
  }
}
