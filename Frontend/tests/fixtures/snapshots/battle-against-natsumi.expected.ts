import type { ComposedState } from "@/memory/state.composer";
import { FieldCentralParkExpected } from "./field-central-park.expected";

export const BattleAgainstNatsumiExpected: Pick<ComposedState, "digimonBattle" | "journal"> = {
  digimonBattle: {
    field: 0,
    enemy: {
      id: 25,
      groupId: 201,
      condition: 0,
      strength: 0,
      defense: 0,
      speed: 0,
      hp: { current: 192, max: 192 },
    },
  },
  journal: FieldCentralParkExpected.journal,
};
