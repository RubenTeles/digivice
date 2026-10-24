import type { CoordinatesViewModel } from "@/ui/viewmodels/quest/coordinates.viewmodel";

export interface DesertAreaDetailsViewModel {
  locationId: string | null;
  imageUrl: string | null;
  coordinates: CoordinatesViewModel | null;
}
