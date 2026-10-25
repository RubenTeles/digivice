import { invoke } from "@tauri-apps/api/core";
import { emulatorWindowLogger } from "@/core/logger/logger";
import {
  EmulatorWindowErrorCodes,
  isKnownEmulatorWindowErrorCode,
  type EmulatorWindowErrorCode,
} from "@/shared/constants/emulator-window-error-code.constant";

/** Area relative to the Digivice webview, in physical pixels. */
export interface EmulatorArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class EmulatorWindowService {
  private static toErrorCode(error: unknown): EmulatorWindowErrorCode {
    if (typeof error === "object" && error !== null) {
      const { code } = error as Record<string, unknown>;
      if (typeof code === "string" && isKnownEmulatorWindowErrorCode(code)) {
        return code;
      }
    }

    return EmulatorWindowErrorCodes.PlacementFailed;
  }

  /** Returns `null` on success, or the error code. */
  public static async fit(area: EmulatorArea): Promise<EmulatorWindowErrorCode | null> {
    try {
      await invoke("fit_emulator_window", { area });
      return null;
    } catch (error) {
      emulatorWindowLogger.warn("fit_emulator_window failed.", error);
      return EmulatorWindowService.toErrorCode(error);
    }
  }

  public static async release(): Promise<void> {
    try {
      await invoke("release_emulator_window");
    } catch (error) {
      emulatorWindowLogger.warn("release_emulator_window failed.", error);
    }
  }

  public static async suspendCut(): Promise<void> {
    try {
      await invoke("suspend_emulator_cut");
    } catch (error) {
      emulatorWindowLogger.warn("suspend_emulator_cut failed.", error);
    }
  }

  public static async resumeCut(area: EmulatorArea): Promise<void> {
    try {
      await invoke("resume_emulator_cut", { area });
    } catch (error) {
      emulatorWindowLogger.warn("resume_emulator_cut failed.", error);
    }
  }
}
