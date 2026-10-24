import FolderJson from "@/content/database/tcg/folder.json";
import type { FolderTable } from "@/game-data/repositories/tables/tcg/folder.table";
import type { FolderRaw } from "@/game-data/repositories/tables/raws/tcg/folder.raw";

export class FolderRepository {
  private static readonly folderTable = FolderJson as FolderTable;

  public static getFolderById(folderId: string): FolderRaw | undefined {
    return this.folderTable[folderId];
  }

  public static getFolderTable(): FolderTable {
    return this.folderTable;
  }
}
