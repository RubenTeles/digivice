import type { AttributesViewModel } from "@/ui/viewmodels/digimon/attributes.viewmodel";
import type { ElementsViewModel } from "@/ui/viewmodels/digimon/elements.viewmodel";

export interface DigimonStatsViewModel {
  attributes: AttributesViewModel;
  elements: ElementsViewModel;
}
