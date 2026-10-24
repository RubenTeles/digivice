import type { LinkViewModel } from "@/ui/viewmodels/digievolution/link.viewmodel";
import type { TechniqueViewModel } from "@/ui/viewmodels/digievolution/technique.viewmodel";

export interface DigievolutionTechniquesViewModel {
  evolutionName: string;
  requirementDigievolutions: LinkViewModel[];
  derivativeDigievolutions: LinkViewModel[];
  techniques: TechniqueViewModel[];
}
