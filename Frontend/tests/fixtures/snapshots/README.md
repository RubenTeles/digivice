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
- Preferir pausar o emulador antes de gerar, para o estado ficar estável.

## Catálogo

| Arquivo | Local no jogo | Party | Ponto da main quest | Uso nos testes |
|---|---|---|---|---|
