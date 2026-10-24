import { EnemyAttributes } from "@/shared/constants/digimon-attribute.constant";
import { DigimonElements } from "@/shared/constants/digimon-element.constant";
import { DigimonStatIcon } from "@/shared/constants/icon.constant";
import type { DigimonStat } from "@/shared/types/digimon-stat.type";
import type { EnemyViewModel } from "@/ui/viewmodels/enemy/enemy.viewmodel";
import type { EnemyStatViewModel } from "@/ui/viewmodels/enemy/enemy-stat.viewmodel";

export class EnemyStatConverter {
  public static convertAttributes(attributes: EnemyViewModel["attributes"]): EnemyStatViewModel[] {
    return EnemyAttributes.map((statKey) => {
      return this.toStatViewModel(statKey, attributes[statKey]);
    });
  }

  public static convertElements(elements: EnemyViewModel["elements"]): EnemyStatViewModel[] {
    return DigimonElements.map((statKey) => {
      return this.toStatViewModel(statKey, elements[statKey]);
    });
  }

  private static toStatViewModel(statKey: DigimonStat, numericValue: number): EnemyStatViewModel {
    return {
      statKey,
      value: numericValue,
      icon: DigimonStatIcon[statKey],
    };
  }
}
