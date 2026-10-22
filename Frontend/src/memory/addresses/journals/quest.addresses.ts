import type {
  RequisiteAddresses,
  RequisiteAddressesRaw,
} from "@/memory/addresses/journals/quests/requisite.addresses";
import type {
  StepAddresses,
  StepAddressesRaw,
} from "@/memory/addresses/journals/quests/step.addresses";

export interface QuestAddressesRaw {
  Id: string;
  Requisites?: RequisiteAddressesRaw[];
  Steps?: StepAddressesRaw[];
}

export interface QuestAddresses {
  id: string;
  requisites: RequisiteAddresses[];
  steps: StepAddresses[];
}
