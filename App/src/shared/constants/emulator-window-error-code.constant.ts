export const EmulatorWindowErrorCodes = {
  ProcessNotFound: "process_not_found",
  WindowNotFound: "window_not_found",
  PlacementFailed: "placement_failed",
} as const;

export type EmulatorWindowErrorCode =
  (typeof EmulatorWindowErrorCodes)[keyof typeof EmulatorWindowErrorCodes];

const knownErrorCodes = new Set<string>(Object.values(EmulatorWindowErrorCodes));

export function isKnownEmulatorWindowErrorCode(value: string): value is EmulatorWindowErrorCode {
  return knownErrorCodes.has(value);
}
