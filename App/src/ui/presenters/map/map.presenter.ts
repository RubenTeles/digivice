import { MapId } from "@/shared/constants/map-id.constant";
import { MapConverter } from "@/ui/presenters/converter/map.converter";
import { MapRepository } from "@/game-data/repositories/map.repository";
import type { MapViewModel } from "@/ui/viewmodels/map/map.viewmodel";

export class MapPresenter {
  public static getByLocationId(id: string): MapViewModel {
    return MapConverter.convert(MapRepository.getMapById(id));
  }

  public static isInBattle(locationId: string): boolean {
    return locationId === MapId.digimonBattle;
  }

  public static isInCardBattle(locationId: string): boolean {
    return locationId === MapId.cardBattle;
  }
}
