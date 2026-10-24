import type { LabelPlacement } from "@/shared/types/label-placement.type";
import type { CoordinatesViewModel } from "@/ui/viewmodels/quest/coordinates.viewmodel";

export type WikiLocationMapMarkerKindViewModel = "npc" | "boss" | "cardShop";

export interface WikiLocationMapMarkerViewModel {
  id: string;
  kind: WikiLocationMapMarkerKindViewModel;
  nameKey?: string;
  name?: string;
  imageUrl: string | null;
  coordinates: CoordinatesViewModel;
  labelPlacement: LabelPlacement;
}
