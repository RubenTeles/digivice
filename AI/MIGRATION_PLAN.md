# Plano de migração — leitura de memória em TS (Tauri + Rust mínimo)

Documento de continuidade do planejamento. Registra o diagnóstico, as decisões tomadas, a arquitetura alvo, a lista de mudanças e as etapas.

## Status

| Etapa | Descrição | Status |
|---|---|---|
| 1 | Fundação de testes | Concluída |
| 2 | Rust: conexão e `read_ram` | Concluída |
| 3 | Snapshot e definitions | Concluída |
| 4 | Fatia vertical: Player | Implementada; aguardando validação manual |
| 5 | Demais entidades | Pendente |
| 6 | Patch in-place e troca da fonte | Pendente |
| 7 | Produção sem sidecar | Pendente |
| 8 | Fechamento de docs | Pendente |

## Contexto e motivação

Hoje o Digivice são duas aplicações:

- **Backend C# (.NET):** sidecar subido pelo Tauri. Lê a RAM do DuckStation a cada 500ms, monta o `State`, calcula diffs e envia eventos via SignalR.
- **Frontend Vue:** recebe os eventos, converte e sincroniza na `useGameStore`. A "mágica" (informação derivada, presenters, UI) acontece aqui.

A ideia: **uma única aplicação**. O Tauri já é o processo host; a UI Vue roda numa webview que não acessa memória de outros processos, então o Rust faz **apenas** a leitura bruta da RAM. Todo o resto (readers, assemblers, game loop, escrita na store) passa para TypeScript, na mesma camada da UI. Sem eventos, SignalR, porta ou sidecar.

O motivo **não** é abandonar o C#; é eliminar a separação em duas aplicações e a duplicação de contrato (DTOs C# ↔ TS, differs ↔ syncers).

## Decisões tomadas

1. **Arquitetura:** Tauri + Rust mínimo + lógica em TS. Electron e sidecar em Node/Bun foram descartados.
2. **Leitura:** o Rust devolve a RAM inteira (2 MB) por tick como binário. Os readers TS usam `DataView` sobre o snapshot.
3. **Diff:** a reatividade do Vue substitui o diff. O loop faz patch in-place na store (primitivo igual não dispara reatividade).
4. **Testes:** a nova camada de leitura (readers, assemblers, definitions, patch da store) **terá testes** (Vitest). O restante do frontend continua sem testes.
5. **Tools:** tudo em `Tools/` deve continuar funcionando **sem alterações**.
6. **Definitions:** a cópia em `Frontend/src/memory/definitions/` é a fonte do TS (parser equivalente ao `HexOrIntStringToIntConverter`). A cópia em `Backend/Memory/Definitions/` continua existindo só para o C# e o `MemoryScanner` até o backend ser apagado. As duas são mantidas iguais por um teste de paridade (`tests/memory/definitions/definitions-parity.spec.ts`). Ver "Pendências para a remoção do backend".
7. **C# permanece no repositório** como referência de paridade. Não é deletado.
8. **Projeto pausado:** nada novo é adicionado (nem no C#, nem no TS) até a migração estar completa, aprovada e funcional.
9. **Comparação permanente em dev:** após a troca da fonte, o caminho SignalR no frontend fica como modo `compare` só para desenvolvimento, por tempo indeterminado. O C# nunca volta para a build de produção.
10. **Docs progressivos:** cada etapa atualiza as regras, skills e docs que ela muda. Etapa só é concluída com docs atualizados.
11. **Etapas revisáveis:** migração em partes, cada uma revisada antes da próxima.
12. **Pasta da camada nova:** `Frontend/src/memory/` (espelha `Backend/Memory/`). Sufixos `.reader.ts`, `.assembler.ts`, `.provider.ts`.
13. **Testes:** Vitest, ambiente `node`, em `Frontend/tests/` espelhando `src/`, arquivos `*.spec.ts` 1:1 com produção. Regra `digivice-frontend-tests.mdc`, skill `frontend-memory-tests`.
14. **Fixtures `.bin`:** versionadas no git em `Frontend/tests/fixtures/snapshots/`, poucas e catalogadas no README da pasta. Geradas pelo `MemoryScanner snapshot`.

## Desenvolvimento local

- Fluxo diário: `npm run tauri:dev` (script já existe). Sobe o Vite com HMR e abre a janela do Tauri apontando para ele (`devUrl`).
- Só a casca Rust é compilada (debug, incremental, em cache). Frontend é servido ao vivo, sem build e sem empacotamento.
- DevTools: botão direito → Inspect / `Ctrl+Shift+I` na janela do Tauri. Vue DevTools via `vite-plugin-vue-devtools` (hoje comentado no `vite.config.ts`).
- `npm run dev` no navegador puro só funciona com o provedor de snapshot por arquivo (`.bin`).
- Modo `compare`: subir também o backend C# (`dotnet run`), como hoje. O proxy `/gamehub` do Vite funciona dentro da janela do Tauri.

## Arquitetura alvo

```mermaid
graph LR
  ram[RAM do DuckStation] -->|"memória compartilhada"| rust["Rust (Tauri): read_ram"]
  rust -->|"ArrayBuffer"| loop["TS: game loop"]
  loop --> readers["TS: readers + Definitions JSON"]
  readers --> assemblers["TS: assemblers"]
  assemblers -->|"patch in place"| pinia[useGameStore]
  pinia --> components[Componentes]
```

Em modo `compare` (dev), o pipeline SignalR atual alimenta um estado "sombra" e um comparador aponta divergências entre os dois `State`.

## Diagnóstico do estado atual (resumo)

**Backend:** `GameLoopService` → `StateComposer` → Providers → Loaders → Readers (Resources) → Assemblers (domínio) → `StateEventFactory` (Differs, `Optional<T>`) → `EventDispatcherService` (SignalR). Erro limpa o estado; recuperação reenvia `InitialState`.

**Frontend:** `SignalRService` → `signalr.handlers.ts` → `useGameStore` (`setInitialState` com converters, `sync{Entity}` com syncers) → `useGameState()`.

Pontos que motivam ou afetam a migração:

- Um campo novo toca cerca de 13 arquivos (JSON, Addresses, Reader, Resource, Assembler, Model, DTO, Converter, Differ + DTO, model, converter e syncer TS).
- Entidades com formato fixo no código (`Npcs` com 27 propriedades, `ImportantItems`), repetidas em todas as camadas.
- Leituras individuais ao longo do tick, sem snapshot consistente.
- Lógica de domínio em readers (`EnemyReader`, `StepReader`).
- Corrida rara: cliente conectando entre o envio do diff e o `UpdateState` pode receber `InitialState` antigo.
- Contrato C# ↔ TS espelhado à mão.

## Mudanças por área

### 1. Rust (Tauri)

- **Remover (etapa 7):** spawn do sidecar, porta livre, `get_backend_port`, evento `backend-crashed` em `Tauri/src/lib.rs`.
- **Novo:** achar o PID do DuckStation e abrir o mapping `duckstation_{pid}` (equivalente a `DuckstationConnector` + `WindowsMemoryProvider`). Crate `windows` (`OpenFileMappingW`/`MapViewOfFile`; processos via ToolHelp, sem `sysinfo`). Nome do processo (`duckstation-qt-x64-ReleaseLTCG`) vira constante.
- **Novo:** comando `read_ram` que copia a RAM e devolve binário, ou código de erro.
  - **Cuidado:** usar `tauri::ipc::Response` (binário). Serializar `Vec<u8>` como JSON vira um array de 2 milhões de números.
  - **Cuidado:** comando `async`. Comandos síncronos rodam na thread principal e podem travar a janela.
- **Cuidado — mapping "congelado":** com o handle aberto, o Windows mantém a memória viva mesmo após o DuckStation fechar. A leitura continuaria devolvendo RAM congelada, sem erro. Checagem de processo vivo a cada chamada pelo handle do processo (`WaitForSingleObject` com timeout 0), em vez de listar processos a cada tick como o `ProcessIdChanged` do C#.
- **Tamanho da RAM (decidido na etapa 2):** snapshot **fixo em 2 MiB**, mesmo com a opção de 8 MB do DuckStation (todos os endereços ficam abaixo de `0x200000`). Mesmo formato dos `.bin` do `MemoryScanner` e do `FakeSnapshotBuilder`. View menor que 2 MiB = `memory_read_failed`.
- **Códigos de erro mantidos:** `process_not_found`, `mapping_not_found`, `connection_failed`, `memory_read_failed`.
- **Capabilities (etapa 7):** remover `shell:allow-execute` do sidecar; manter `shell:allow-open` (usado por `external-link.service.ts`).

### 2. Camada de leitura em TS

- **Feito na etapa 3 — provedores de snapshot:** `TauriSnapshotProvider` (`invoke("read_ram")`) e `FileSnapshotProvider` (`fetch` de um `.bin` de 2 MiB, formato do `MemoryScanner snapshot`). Ambos devolvem `MemorySnapshot` ou lançam `EmulatorConnectionError` (`code`, `detail`).
- **Novo — readers puros sobre `MemorySnapshot`** (feito na etapa 3: `readByte`/`readByte(bitMask)`/`readInt16`/`readInt32`/`readBytes`, equivalente ao `IMemoryReader`).
  - **Cuidado — sinal e endianness:** `Int16` → `getInt16(addr, true)`, `Int32` → `getInt32(addr, true)`, byte → `getUint8`. Ler `Int16` sem sinal faria o sentinela `0xFFFF` (hoje `-1` → `null`) virar `65535`.
- **Definitions (feito na etapa 3):** `AddressesRepository` importa os JSONs de `Frontend/src/memory/definitions/` (`@/memory/definitions/...`). Parser para hex (`"0x48"`), decimal (`"20"`) e negativo (`"-4"` em `ActiveDigievolution`); valor inválido **lança** (o C# cai para `0`). Quests por pasta via `import.meta.glob`, ordenadas pelo nome do arquivo como no C#. O frontend não depende de nada fora de `Frontend/`.
- **Sem blocos de memória:** com o snapshot, tudo é endereço absoluto (base + offset). O bloco de 1500 bytes do Digimon deixa de existir.
- **Comportamentos de leitura a preservar exatamente:**
  - `StepReader`: sem máscara lê o byte; uma máscara aplica `&`; várias exigem todas ativas e o valor final usa a primeira.
  - `EnemyReader`: slot ativo = índice ativo válido com id → primeiro com id e HP > 0 → último com id → 0.
  - `InBattleReader`: índice do slot da party começa em 1 (`partySlotIndex - 1`).
  - `StoredDigievolutionReader`: até 60 entradas, para no primeiro id `<= 0`.
  - `PartyLoader`: só lê o Digimon se `DigimonId != EmptySlotId`.
  - Blast: endereço próprio por Digimon (`BlastAddress`).
- **Novo — assemblers** que devolvem os models já existentes em `Frontend/src/models`. Normalizações a portar:
  - `mapId`/`previousMapId` em hex com 4 dígitos (`X4`).
  - `seabedRoute` e `mapVariant`: `0` → `null`.
  - `activeDigievolutionId <= 0` → `null`.
  - Equipamentos `<= 0` → `null`.
  - Slot de digievolução: id `<= 0` → vazio; preenchido busca `level`/`dvexp` em `storedDigievolutions` (ausente → `level = 1`, `dvexp = 0`); `dvexp` negativo → `0`.
  - Inimigo com id `<= 0` → `enemy = null`.
  - Card battle com id `<= 0` → `null`.
  - Important items: `!= 0` → `true`.
  - Auctions: bit em `0x4B38A`.
  - NPCs: `won = value != 0`.
  - Cascade da main quest.
  - Normalização da Duel Island.

### 3. Game loop e health

- **Novo — loop TS:** `setTimeout` encadeado a cada 500ms (nunca sobrepor ticks): `read_ram` → readers → assemblers → patch.
- **Health:**
  - Somem: `sidecar-crashed` e `hub-unreachable` (`useAppHealthyScreen`).
  - Ficam: `loading` (antes do primeiro tick bem-sucedido), `operational-error` (códigos do Rust + `state_compose_failed` quando reader/assembler lança exceção) e `healthy`.
  - `config_missing` provavelmente some (nome do processo vira constante).
- **Cuidado — invariantes:** healthy implica estado presente; erro limpa `currentState` (UI desmonta); recuperação gera estado completo novo.
- **Cuidado — HMR:** cancelar o timer em `import.meta.hot.dispose`, senão cada hot reload cria mais um loop.
- **Cuidado — throttling:** com a janela minimizada, o WebView2 pode reduzir timers. Hoje não quebra nada (sem histórico entre leituras), mas precisa ser confirmado. Alternativa: o Rust conduz o loop e empurra o snapshot por evento.

### 4. Store (`useGameStore`)

- **Novo — patch in-place genérico,** campo a campo, com listas casadas por chave:
  - slots por `index`; digievoluções por `index`; `storedDigievolutions` por `digievolutionId`;
  - quests por `id`; steps por `number`; requisites por `id`; batalhas de NPC por `id`.
  - Transições objeto ↔ `null` (inimigo, Digimon do slot) substituem o objeto inteiro.
  - **Cuidado:** nunca substituir o `State` ou listas inteiras a cada tick (re-render total duas vezes por segundo).
- **Cuidado — regras que dependem do estado anterior** (hoje nos syncers; vão para o patch):
  - Slot de digievolução preenchido → vazio é ignorado, com `storeLogger.warn`.
  - `storedDigievolutions` só cresce (`push`).
  - Slot com Digimon trocado substitui o Digimon inteiro.
- Primeiro tick equivale ao `InitialState` (atribui o `State` completo).
- **Continua igual:** `currentState` anulável, 8 entidades nunca `null`, 3 slots fixos, `useGameState()`, selectors, presenters e componentes.

### 5. Frontend: o que deixa de ser o caminho principal

Mantido apenas para o modo `compare` (dev), por decisão 9:

- `events/` (`signalr.service`, `signalr.handlers`, `events.map`, `dto/`, `converters/`, `hub-connection-error`), `stores/syncers/`, actions `sync*`, proxy `/gamehub`, `AppConfig.backend`, `@microsoft/signalr`.

Removido do caminho de produção:

- `tauri-backend-process.listener`, `setBackendProcessFailed`, `syncHubConnectionStatus` e estados correspondentes, chaves i18n `sidecarCrashed`/`hubUnreachable`.
- `events/logger.ts` e os códigos de erro do emulador são reaproveitados (podem mudar de pasta).

### 6. Repositório e build

- **Mantidos:** `Backend/`, `Tests/` (xUnit), `Digivice.slnx` e `Tools/` inteiro.
- **Produção (etapa 7):** remover do `tauri.conf.json` `externalBin`, `resources` (appsettings, `Memory/`) e `beforeBundleCommand`; o script `Tauri/scripts/copy-sidecar-runtime.ps1` deixa de ser usado.
- `DebugConsoleRenderer` (`Features:Debugging`): substituto natural é o inspetor de Pinia do `vite-plugin-vue-devtools` ou um painel de debug.

### 7. Testes (nova camada TS)

- **Vitest** restrito à camada de leitura nova. Exceção explícita na regra "sem testes no frontend" (`digivice-frontend.mdc`).
- **Checklist de paridade:** cada `*ReaderTests`, `*AssemblerTests` e `AddressesRepositoryDefinitionsTests` do C# ganha equivalente TS. Testes de Differ, Converter, EventFactory e Hub não têm equivalente (camadas não existem no modelo novo).
- **Helper de snapshot falso:** monta um `ArrayBuffer` escrevendo `int16`/`int32`/byte em endereços. Substitui o mock de `IMemoryReader`.
- **Fixtures reais:** `.bin` do `MemoryScanner snapshot`.
- **Patch da store:** testes para as regras que dependem do estado anterior.

### 8. Tools

- Devem continuar funcionando **sem alteração** durante a migração.
- `Tools/MemoryScanner/Program.cs` (`FindMainQuestDefinitionsPath`) procura `Backend/Memory/Definitions/Quests/MainQuestAddresses.json` por caminho fixo → a cópia do backend não pode mudar de lugar enquanto existir. Quando o backend for apagado, a ferramenta precisa ser atualizada (ver "Pendências para a remoção do backend").
- `MemoryScanner snapshot <file.bin>` já gera o dump de 2 MiB que a camada TS consome (fixtures e modo navegador).
- `analyze_snapshots.py` e `Tools/Scripts/Spliting-images.py` não são afetados.

### 9. Docs, regras, skills e agents (progressivo)

- **Reescrever/fundir:** `digivice-backend.mdc` e `digivice-tests.mdc` (marcar como legado/paridade), `digivice-frontend-sync.mdc`, `digivice-frontend.mdc` (exceção de testes), `digivice-business.mdc` (diagrama de arquitetura, menções a GameLoopService/eventos/Differs).
- **Skills:** `address-field-backend` + `address-field-frontend`, `memory-entity-backend` + `memory-entity-frontend`, `quest-pattern-backend`, `backend-tests` → novas skills para a camada TS.
- **Ajustar:** agent `memory-investigator`, skills `memory-compare` e `battle-memory-investigate`, agent `docs-auditor`, índices em `AI/*.md`.

### 10. Pendências para a remoção do backend

O C# não é apagado nesta migração (decisão 7). Quando for, no mesmo momento:

- **Atualizar `Tools/MemoryScanner/Program.cs` (`FindMainQuestDefinitionsPath`)** para procurar `Frontend/src/memory/definitions/Quests/MainQuestAddresses.json`, para a ferramenta continuar funcionando. Única exceção prevista à regra "Tools sem alteração", feita junto com a remoção.
- Apagar `Frontend/tests/memory/definitions/definitions-parity.spec.ts` (não haverá mais cópia do backend para comparar).
- Revisar referências a `Backend/Memory/Definitions/` em regras, skills e agents (as skills legadas do backend saem junto).

## Comparação C# × TS

- Os dois lados produzem o mesmo tipo `State` (`@/models`): C# via `StateDTO` → converters existentes; TS via assemblers. Comparar = deep-compare dos dois `State`, reportando o caminho divergente (ex.: `party.slots[0].digimon.hp.current: C#=120, TS=118`).
- **Modo de execução** (dev, via variável de ambiente): `csharp | typescript | compare`. No `compare`, um lado alimenta a store e o outro vai para um estado sombra.
- **Timing:** os dois leem em momentos diferentes; campos voláteis divergem por um instante. Mitigações:
  - DuckStation **pausado**: RAM parada, tudo tem que bater 100%.
  - Com o jogo rodando: só reportar divergências que persistam por N ticks seguidos.
- **Produção:** mantém o sidecar até a etapa 6/7; depois sai do bundle. O C# fica no repositório.

## Critério de "pronto" de cada etapa

- Testes passando.
- Comparador sem divergências na(s) entidade(s) da etapa, com o emulador pausado em cenários variados (campo, batalha, card battle, quests em pontos diferentes).
- Docs, regras e skills afetados atualizados.
- Revisão e aprovação antes da próxima etapa.

## Etapas

1. **Fundação de testes:** Vitest restrito à camada nova, convenção de local/nome dos testes, helper de snapshot falso, uso dos `.bin` como fixtures, exceção na regra de testes.
2. **Rust:** conexão, `read_ram`, códigos de erro, checagem de processo vivo. Convive com o sidecar; nada consome ainda.
3. **Snapshot e definitions:** provedores (Tauri e arquivo `.bin`), cópia dos JSONs de definitions para o frontend, parser e testes de integridade e de paridade das definitions.
4. **Fatia vertical do Player:** reader, assembler, testes, game loop TS em modo sombra, health básico e comparador. Prova a arquitetura inteira.
5. **Uma entidade por etapa (simples → complexa):** ImportantItems, Auctions, CardBattle, Npcs, Journal (cascades), Party/Digimon, DigimonBattle (heurística do inimigo). Cada uma com testes e entrando no comparador.
6. **Patch in-place e troca da fonte:** regras dependentes do estado anterior, com testes. A store principal passa a ser alimentada pelo TS; o C# vira o lado sombra.
7. **Produção sem sidecar:** `lib.rs`, `tauri.conf.json`, capabilities. SignalR fica só no modo `compare`.
8. **Fechamento de docs:** revisão final de regras, skills, agents e índices (o grosso já foi feito em cada etapa).

## Registro das etapas

### Etapa 1 — Fundação de testes (concluída)

- Vitest 5 (compatível com o Vite 7) com scripts `npm run test` (watch) e `npm run test:run`.
- `Frontend/vitest.config.ts` herda `vite.config.ts`; inclui apenas `tests/**/*.spec.ts`; ambiente `node`.
- `Frontend/tsconfig.vitest.json` (referenciado no `tsconfig.json`) faz o `npm run type-check` cobrir `tests/`.
- Helpers em `Frontend/tests/helpers/`: `FakeSnapshotBuilder` (snapshot sintético little-endian, aceita negativos, valida limites e faixas) e `SnapshotFixtureLoader` (carrega `.bin` de 2 MiB), com testes.
- `Frontend/tests/fixtures/snapshots/README.md` com geração e catálogo (ainda sem fixtures; as primeiras entram na etapa 4).
- `PlayStationRamSize` vivia em `tests/helpers/snapshot.constant.ts`; subiu para `src/memory/snapshot/` na etapa 3.
- Docs: `digivice-frontend.mdc` (escopo de testes e sufixos), nova `digivice-frontend-tests.mdc`, nova skill `frontend-memory-tests`, `digivice-tests.mdc`/`backend-tests` marcados como legado, `AI/CODE_RULES.md` e `docs-auditor` atualizados.

### Etapa 2 — Rust: conexão e `read_ram` (concluída)

- Crate `windows` 0.61 (mesma versão já usada pelo Tauri). Módulo `Tauri/src/memory/` (`process`, `mapping`, `handle`, `session`, `error`) e comando `read_ram` em `Tauri/src/commands.rs`, registrado no `lib.rs` com `MemoryState`. Sidecar inalterado.
- `read_ram` (`async`): confere processo vivo, conecta/reconecta, copia 2 MiB e devolve binário (`tauri::ipc::Response`). Erros `{ code, detail }`: `process_not_found`, `mapping_not_found`, `connection_failed`, `memory_read_failed`. Qualquer erro descarta a sessão.
- Paridade de erros com o C#: qualquer falha ao abrir/mapear a memória compartilhada vira `mapping_not_found` (como o `WindowsMemoryProvider`); falha ao listar/abrir o processo vira `connection_failed`.
- Sem `cargo test` (decisão): validação manual no DevTools **da janela do Tauri** (`npm run tauri:dev`, `Ctrl+Shift+I`). No navegador comum não existe a ponte com o Rust.
- Docs: nova regra `digivice-tauri.mdc`, linha em `AI/CODE_RULES.md`.
- **Validação manual (aprovada):**
  - `read_ram` devolve 2097152 bytes; o byte em `0x4B3F8` bate com o mapa atual do jogo.
  - Tempo por chamada: 21–27 ms (build debug, 5 chamadas seguidas). O custo é a transferência pela IPC, não a cópia; folga ampla no tick de 500 ms.
  - DuckStation fechado → `process_not_found`. Exportação de memória compartilhada desligada → `mapping_not_found`. Fechar e reabrir o DuckStation reconecta sozinho, sem reiniciar o Tauri.
  - UI atual (C# via SignalR) continua funcionando em paralelo.
- **Observação para a etapa 4:** com a exportação ligada, o DuckStation cria a memória compartilhada ao abrir, mesmo **sem jogo carregado**; o `read_ram` conecta e devolve a RAM (quase toda zerada). O C# tem o mesmo comportamento (paridade), mas o health TS precisa considerar o caso "conectado sem jogo". Decidido na etapa 4: manter a paridade, sem tratamento especial.

### Etapa 3 — Snapshot e definitions (concluída)

- `Frontend/src/memory/` criado, espelhando `Backend/Memory/`:
  - `snapshot/`: `MemorySnapshot`, `SnapshotProvider`, `TauriSnapshotProvider`, `FileSnapshotProvider`, `MemoryReadError`, `EmulatorConnectionError`, `PlayStationRamSize`.
  - `addresses/`: tipos de endereço de todos os 30 JSONs (tipo final camelCase + `...Raw` PascalCase no mesmo arquivo). `NpcsAddresses` derivado das chaves do model `Npcs` (29 NPCs).
  - `converters/`: `AddressValueConverter` + um converter por arquivo de definitions.
  - `repositories/addresses.repository.ts`: mesmos métodos do `AddressesRepository` C#, cache lazy.
  - `definitions/`: cópia dos 30 JSONs de `Backend/Memory/Definitions/` (mesmos nomes e pastas; formatados pelo Prettier com 2 espaços). Fonte do TS.
- Config: nenhuma dependência fora de `Frontend/` (sem alias extra, sem `server.fs.allow`). Build de produção embute os JSONs no bundle.
- Decisões: todos os JSONs nesta etapa; definitions copiadas para o frontend (o backend será apagado no futuro), com teste de paridade enquanto as duas cópias existirem; valor inválido ou campo escalar ausente **lança** ao carregar (divergência intencional do C#; listas ausentes continuam `[]`); o provedor por arquivo recebe a URL no construtor; a escolha do provedor (e a variável `VITE_MEMORY_SNAPSHOT_URL`) fica para a etapa 4.
- Testes portados: `MemoryReaderTests`, os 3 testes de conversores e `AddressesRepositoryDefinitionsTests` (+ ordem das quests). Mais specs dos providers com `invoke`/`fetch` simulados e o teste de paridade das definitions (mesmo conjunto de arquivos e mesmo conteúdo interpretado). Total: 116 testes.
- Docs: `digivice-frontend.mdc` (estrutura de `src/memory/`, sufixos, terceiro contexto de converters), `digivice-frontend-tests.mdc` e skill `frontend-memory-tests` (mocks, checklist de paridade com status), `digivice-backend.mdc` (cópia das definitions no frontend), skills/agents de investigação apontando para a cópia do frontend.

### Etapa 4 — Fatia vertical do Player (implementada; aguardando validação manual)

- Leitura do Player em `Frontend/src/memory/`: `resources/player.resource.ts`, `readers/player.reader.ts`, `assemblers/player.assembler.ts` (hex `X4` com `& 0xffff`, `0` → `null`), `providers/player.provider.ts` (substitui Loader + Provider do C#) e `state.composer.ts` (`ComposedState = Pick<State, "player">`, cresce por etapa; `pick` recorta o `State` do C# para comparar).
- Loop em `src/memory/loop/`: `GameLoop` (`setTimeout` encadeado de 500 ms, sem sobreposição, leitura em andamento descartada no `stop`), `SnapshotProviderFactory` (`VITE_MEMORY_SNAPSHOT_URL` → arquivo; senão Tauri → `read_ram`; senão nada) e `initializeMemoryLoop` (no `main.ts`, para o loop no `import.meta.hot.dispose`).
- Health sombra equivalente ao `HealthEventFactory`: `Loading` até o primeiro sucesso, `Healthy` com estado, `Error` limpa o estado e guarda código e detalhe. Emulador aberto sem jogo: sem tratamento especial (paridade com o C#; tratar seria funcionalidade nova).
- Ativação: `VITE_MEMORY_MODE=compare` (padrão `csharp`, loop desligado), em `Frontend/.env.development.local`. Estado em `useMemoryShadowStore` (nenhum componente lê).
- Comparador: `StateComparator` (deep-compare com caminho) + `DivergenceTracker` (reporta após 3 leituras seguidas e avisa a resolução). A cada leitura do TS compara `health.status`/`health.errorCode` e `state` (entidades migradas; um lado `null` e o outro não = divergência em `state`). Saída no console (`[Compare]`); health do TS logado em `[Memory]` quando muda.
- Primeira fixture real: `field-central-park.bin` (catalogada).
- Testes: porte de `PlayerReaderTests`, `PlayerLoaderTests`, `PlayerAssemblerTests` e `PlayerProviderTests` (+ `-1` → `"FFFF"`, sentinelas), provider e composer sobre a fixture, `GameLoop` com timers falsos, comparator, tracker e factory. Total: 166 testes.
- Verificação automática: em dev com `VITE_MEMORY_MODE=compare` e a fixture, o loop lê o `.bin` a cada 500 ms, health TS `Healthy`, sem erros e sem divergências contra o C# conectado ao DuckStation pausado no mesmo ponto da fixture.
- Docs: `digivice-frontend.mdc` (camadas, sufixos, variáveis `VITE_MEMORY_*`), `digivice-frontend-tests.mdc` (escopo), skill `frontend-memory-tests` (formatos de teste por camada, checklist).
- **Validação manual pendente** (Tauri + DuckStation, `VITE_MEMORY_MODE=compare`, sem `VITE_MEMORY_SNAPSHOT_URL`): emulador pausado em mapas variados (rota do fundo do mar e mapa com variante) sem divergências; jogo rodando com no máximo divergências breves; fechar o DuckStation → os dois lados em `Error`/`process_not_found`; reabrir → os dois se recuperam; sem a variável, app igual ao atual.

## Decisões em aberto

- Patch genérico por chaves de lista vs. patch específico por entidade.
- Confirmar suporte de configuração de background throttling do Tauri no WebView2.
