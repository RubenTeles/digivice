# Snapshots de RAM (fixtures)

Dumps da RAM do PS1 (2 MiB, `0x00000000`–`0x001FFFFF`, little-endian) usados pelos testes da camada de leitura (`src/memory/`). Carregados via `SnapshotFixtureLoader.load("{nome}")` (`tests/helpers/snapshot-fixture.loader.ts`), que valida o tamanho.

## Como gerar

Com o DuckStation rodando o jogo no ponto desejado, usar o `MemoryScanner` (sem alterações na ferramenta):

```powershell
cd Tools/MemoryScanner
dotnet run -- snapshot Snapshots/{nome}.bin
```

Copiar o arquivo para esta pasta e registrar no catálogo abaixo.

## Convenções

- Nome em kebab-case descrevendo o cenário: `field-asuka-city.bin`, `battle-single-enemy.bin`, `card-battle.bin`.
- Manter poucas fixtures, cada uma com propósito claro (cerca de 2 MB cada no histórico do git).
- Toda fixture **deve** estar no catálogo; fixture sem descrição não entra.
- Valores esperados de uma fixture usados em mais de um spec ficam em `{nome}.expected.ts` nesta pasta (ex.: `field-central-park.expected.ts`, tipado como `ComposedState`; cresce junto com o composer).
- Preferir pausar o emulador antes de gerar, para o estado ficar estável.

## Catálogo

| Arquivo | Local no jogo | Party | Ponto da main quest | Uso nos testes |
|---|---|---|---|---|
| `field-central-park.bin` | Central Park (`mapId` `021D`, anterior `1000`, sem rota e sem variante); 42206 bits | Kotemon (24), Patamon (20), Renamon (20) | Passo 61 concluído, no passo 62 | Player, ImportantItems (Tree Boots e Fishing Pole), Auctions (byte `0x0B`: Divine Barrier, Hazard Shield e Dramon Shield consumidos), CardBattle (fora de card battle, RAM `-1`), Npcs (Genji 1ª, líderes Seiryu/Suzaku/Byakko, Byakko falso, Keith e AoA Attacker vencidos) nos `providers/*.provider.spec.ts` e `state.composer.spec.ts`; depois party e journal |
