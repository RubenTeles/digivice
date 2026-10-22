// Temporary guard while Backend/ exists: delete this spec together with the backend.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const FrontendDefinitionsDirectory = fileURLToPath(
  new URL("../../../src/memory/definitions/", import.meta.url),
);
const BackendDefinitionsDirectory = fileURLToPath(
  new URL("../../../../Backend/Memory/Definitions/", import.meta.url),
);

function listJsonFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true, encoding: "utf8" })
    .filter((relativePath) => relativePath.endsWith(".json"))
    .map((relativePath) => relativePath.replaceAll("\\", "/"))
    .sort();
}

function readJson(directory: string, relativePath: string): unknown {
  return JSON.parse(readFileSync(join(directory, relativePath), "utf8"));
}

describe("Definitions parity", () => {
  const frontendFiles = listJsonFiles(FrontendDefinitionsDirectory);
  const backendFiles = listJsonFiles(BackendDefinitionsDirectory);

  it("should have the same definition files in the frontend and backend copies", () => {
    expect(frontendFiles).not.toHaveLength(0);
    expect(frontendFiles).toEqual(backendFiles);
  });

  it.each(frontendFiles)("should have the same content in both copies of %s", (relativePath) => {
    expect(readJson(FrontendDefinitionsDirectory, relativePath)).toEqual(
      readJson(BackendDefinitionsDirectory, relativePath),
    );
  });
});
