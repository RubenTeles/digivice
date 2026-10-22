import type {
  QuestAddresses,
  QuestAddressesRaw,
} from "@/memory/addresses/journals/quest.addresses";
import type {
  RequisiteAddresses,
  RequisiteAddressesRaw,
} from "@/memory/addresses/journals/quests/requisite.addresses";
import type {
  StepAddresses,
  StepAddressesRaw,
} from "@/memory/addresses/journals/quests/step.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";

export class QuestAddressesConverter {
  private static convertId(id: string | undefined): string {
    if (typeof id !== "string" || id === "") {
      throw new Error(`Invalid id: ${JSON.stringify(id)}.`);
    }

    return id;
  }

  private static convertRequisite(raw: RequisiteAddressesRaw): RequisiteAddresses {
    return {
      id: QuestAddressesConverter.convertId(raw.Id),
      address: AddressValueConverter.convert(raw.Address),
      bitMasks: AddressValueConverter.convertList(raw.BitMasks),
    };
  }

  private static convertRequisites(
    raws: RequisiteAddressesRaw[] | undefined,
  ): RequisiteAddresses[] {
    return (raws ?? []).map((raw) => QuestAddressesConverter.convertRequisite(raw));
  }

  private static convertStep(raw: StepAddressesRaw): StepAddresses {
    return {
      number: AddressValueConverter.convert(raw.Number),
      address: AddressValueConverter.convert(raw.Address),
      bitMasks: AddressValueConverter.convertList(raw.BitMasks),
      requisites: QuestAddressesConverter.convertRequisites(raw.Requisites),
    };
  }

  public static convert(raw: QuestAddressesRaw): QuestAddresses {
    return {
      id: QuestAddressesConverter.convertId(raw.Id),
      requisites: QuestAddressesConverter.convertRequisites(raw.Requisites),
      steps: (raw.Steps ?? []).map((step) => QuestAddressesConverter.convertStep(step)),
    };
  }
}
