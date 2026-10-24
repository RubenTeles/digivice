import { ImageCatalog } from "@/ui/catalogs/image.catalog";
import { SeabedModalConverter } from "@/ui/presenters/converter/dock.converter";
import { MapRepository } from "@/game-data/repositories";
import { SeabedDockRepository } from "@/game-data/repositories/seabed-dock.repository";
import type { SeabedModalViewModel } from "@/ui/viewmodels/seabed-modal/seabed-modal.viewmodel";

export class SeabedModalPresenter {
  public static getInitialSelectedLocationId(playerLocationId: string | null): string | null {
    if (playerLocationId === null) {
      return null;
    }

    const locationRaw = MapRepository.getMapById(playerLocationId);
    if (locationRaw.dock !== true) {
      return null;
    }

    return playerLocationId;
  }

  public static getViewModel(locationId: string | null): SeabedModalViewModel | null {
    if (locationId === null) {
      return null;
    }

    const locationRaw = MapRepository.getMapById(locationId);
    if (locationRaw.dock !== true) {
      return null;
    }

    const seabedDockRaw = SeabedDockRepository.getDockByLocationId(locationId);
    if (seabedDockRaw === null) {
      return null;
    }

    const imageUrl = ImageCatalog.getLocationImageUrl(locationRaw.imageName);

    return SeabedModalConverter.convert(seabedDockRaw, imageUrl);
  }
}
