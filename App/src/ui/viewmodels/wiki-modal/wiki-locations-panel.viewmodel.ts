import type { MapFrameSlideViewModel } from "@/ui/viewmodels/map-frame/map-frame-slide.viewmodel";
import type { WikiLocationEncounterLineViewModel } from "@/ui/viewmodels/wiki-modal/wiki-location-encounter-line.viewmodel";
import type { WikiLocationMapMarkerViewModel } from "@/ui/viewmodels/wiki-modal/wiki-location-map-marker.viewmodel";

export interface WikiLocationsPanelViewModel {
  asukaSlides: MapFrameSlideViewModel[];
  localSlides: MapFrameSlideViewModel[];
  selectedLocationLabelKey: string | null;
  encounterLines: WikiLocationEncounterLineViewModel[];
  mapMarkers: WikiLocationMapMarkerViewModel[];
}
