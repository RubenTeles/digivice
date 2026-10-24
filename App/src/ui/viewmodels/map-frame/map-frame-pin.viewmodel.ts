import type { CoordinatesViewModel } from "@/ui/viewmodels/quest/coordinates.viewmodel";

export interface MapFramePinViewModel {
  coordinates: CoordinatesViewModel;
  label?: string | null;
}
