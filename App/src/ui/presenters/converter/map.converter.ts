import { ImageCatalog } from "@/ui/catalogs/image.catalog";
import type { MapRaw } from "@/game-data/repositories/tables/raws/map/map.raw";
import type { MapViewModel } from "@/ui/viewmodels/map/map.viewmodel";

export class MapConverter {
  public static convert(locationRaw: MapRaw): MapViewModel {
    return {
      locationRegion: locationRaw.region ?? "asukaServer",
      locationImageUrl: ImageCatalog.getLocationImageUrl(locationRaw.imageName),
    };
  }
}
