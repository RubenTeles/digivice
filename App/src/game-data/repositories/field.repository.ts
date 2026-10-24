import FieldJson from "@/data/field.json";
import type { FieldTable } from "@/game-data/repositories/tables/battle/field.table";
import type { FieldRaw } from "@/game-data/repositories/tables/raws/battle/field.raw";

export class FieldRepository {
  private static readonly fieldTable = FieldJson as FieldTable;

  public static getFieldById(fieldId: number): FieldRaw | null {
    return this.fieldTable[fieldId] ?? null;
  }
}
