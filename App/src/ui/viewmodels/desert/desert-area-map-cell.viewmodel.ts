import type { CoordinatesViewModel } from "@/ui/viewmodels/quest/coordinates.viewmodel";

export interface DesertAreaMapCellViewModel {
  label: string;
  north: string;
  east: string;
  south: string;
  west: string;
  coordinates?: CoordinatesViewModel;
}
