---
name: frontend-memory-tests
description: >-
  Concrete conventions for writing Digivice frontend tests (Vitest) for the
  memory reading layer (src/memory/) — where each test goes, naming,
  FakeSnapshotBuilder for synthetic RAM, SnapshotFixtureLoader for real 2 MiB
  .bin dumps from Tools/MemoryScanner, and the parity checklist against the
  legacy C# Tests/. Use when creating or updating tests under Frontend/tests/,
  after porting a backend reader/assembler to TS, or when the user asks for
  test coverage of the memory layer.
---

# Frontend Memory Tests

Rules (scope, 1:1 file mapping, naming, corner cases): `.cursor/rules/digivice-frontend-tests.mdc`.
This skill is the practical how-to. Only the memory reading layer has tests; the rest of the frontend does not.

Migration context: `AI/MIGRATION_PLAN.md`.

## Stack

- Vitest (`describe`, `it`, `expect`, `vi`), environment `node`, explicit imports from `vitest`.
- Config: `Frontend/vitest.config.ts` (merges `vite.config.ts`, so `@/`, `import.meta.glob` and JSON imports resolve exactly like the app). Includes only `tests/**/*.spec.ts`.
- Types: `Frontend/tsconfig.vitest.json`, part of `npm run type-check`.
- Run (in `Frontend/`): `npm run test:run` (single run) or `npm run test` (watch). Filter: `npx vitest run tests/helpers`.

## Where each test goes

Mirror `src/` under `tests/`, one spec per production file:

| Production | Test file |
|---|---|
| `src/memory/{folder}/{name}.ts` | `tests/memory/{folder}/{name}.spec.ts` |
| Test helper `tests/helpers/{name}.ts` | `tests/helpers/{name}.spec.ts` |

Helpers and fixtures:

| Path | Purpose |
|---|---|
| `tests/helpers/fake-snapshot.builder.ts` | `FakeSnapshotBuilder`: synthetic snapshot |
| `tests/helpers/snapshot-fixture.loader.ts` | `SnapshotFixtureLoader`: real `.bin` dumps |
| `tests/helpers/snapshot.constant.ts` | `PlayStationRamSize` (2 MiB) |
| `tests/fixtures/snapshots/` | `.bin` fixtures + catalog `README.md` |

## Synthetic snapshot (`FakeSnapshotBuilder`)

Replaces the C# `Mock<IMemoryReader>` and `LoaderIntegrationTestBase.WriteInt16/WriteInt32`.

```ts
const snapshot = new FakeSnapshotBuilder()
  .writeInt16(0x0004b3f8, 0x0600)
  .writeInt32(0x00048da0, 1500)
  .writeByte(0x00048d78, 0)
  .build();
```

- Zeroed 2 MiB `ArrayBuffer` by default (custom size via constructor, only for helper-level tests).
- Little-endian. Accepts signed and unsigned ranges: `writeInt16(address, -1)` writes `0xFFFF` (use it for sentinels).
- Throws `RangeError` when the address is outside the snapshot or the value does not fit the size.
- `build()` returns a copy; later writes do not affect built snapshots.

## Real snapshot (`SnapshotFixtureLoader`)

```ts
const snapshot = SnapshotFixtureLoader.load("field-asuka-city");
```

- Reads `tests/fixtures/snapshots/{name}.bin`, validates 2 MiB, returns a standalone `ArrayBuffer`.
- Generate with `Tools/MemoryScanner` (`dotnet run -- snapshot Snapshots/{name}.bin`), copy here and add a row to the catalog in `tests/fixtures/snapshots/README.md`. Uncatalogued fixtures are not allowed.
- Keep fixtures few and purposeful (about 2 MB each in git history).

## Parity checklist with the C# `Tests/`

The C# project is frozen as parity reference. When porting a backend piece to TS, port its tests too:

| C# test | TS equivalent |
|---|---|
| `Tests/Unit/Memory/Readers/{X}ReaderTests.cs` | reader spec with `FakeSnapshotBuilder` |
| `Tests/Integration/Application/Loaders/{X}LoaderTests.cs` | reader spec using the real definitions JSON |
| `Tests/Unit/Domain/Assemblers/**/{X}AssemblerTests.cs` | assembler spec (pure functions) |
| `AddressesRepositoryDefinitionsTests`, `Memory/Converters/*Tests` | definitions/parser specs |
| Differ, DTO Converter, EventFactory, Hub, DI, `Optional`, `GameStateStore` | none (layers do not exist in the TS model) |

Reader and assembler test shapes are documented here once the first ones exist (migration step 4).

## Corner-case pass (before finishing)

Re-read the production code and add tests for: sentinel boundaries (`-1`, `0`, `1`), `0xFFFF` read as signed, multiple bitmasks (all must match), raw-byte steps (empty bitmasks), empty collections, lookup by id vs list index, short/missing snapshot and missing definition paths.
