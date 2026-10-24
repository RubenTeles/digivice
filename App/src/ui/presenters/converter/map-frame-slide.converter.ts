import type { MapFrameSlideViewModel } from "@/ui/viewmodels/map-frame/map-frame-slide.viewmodel";
import type { CoordinatesViewModel } from "@/ui/viewmodels/quest/coordinates.viewmodel";

export class MapFrameSlideConverter {
  public static convert(
    imageUrl: string | null,
    coordinates: CoordinatesViewModel | null,
    label?: string | null,
  ): MapFrameSlideViewModel {
    if (coordinates === null) {
      return {
        imageUrl,
        pins: [],
      };
    }

    return {
      imageUrl,
      pins: [
        {
          coordinates,
          label: label ?? undefined,
        },
      ],
    };
  }
}
