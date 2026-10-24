import { MapService } from "@/game-data/services/map.service";

export class SeabedMapPresenter {
  public static getEnemyIds(seabedRoute: number | null): string[] {
    return MapService.getSeabedEnemies(seabedRoute);
  }
}
