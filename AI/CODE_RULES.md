# Regras de código — índice

A fonte única das regras de código é a pasta `.cursor/`. Este arquivo existe apenas como ponto de entrada para leitura humana.

| Tema | Arquivo |
|------|---------|
| Diretrizes gerais (tom, foco, aprovação de planos, naming, `if` com chaves, comentários) | [.cursor/rules/digivice-core.mdc](../.cursor/rules/digivice-core.mdc) |
| Backend C# (congelado, só referência) | [.cursor/rules/digivice-backend.mdc](../.cursor/rules/digivice-backend.mdc) |
| Tauri / Rust (ponte de leitura da RAM, `read_ram`, `unsafe`) | [.cursor/rules/digivice-tauri.mdc](../.cursor/rules/digivice-tauri.mdc) |
| Frontend básico (sintaxe, imports, converters, escopo de testes) | [.cursor/rules/digivice-frontend.mdc](../.cursor/rules/digivice-frontend.mdc) |
| Testes Frontend (Vitest, camada de leitura de memória) | [.cursor/rules/digivice-frontend-tests.mdc](../.cursor/rules/digivice-frontend-tests.mdc) |
| Frontend dados estáticos (presenters, services, repositories, i18n, assets) | [.cursor/rules/digivice-frontend-data.mdc](../.cursor/rules/digivice-frontend-data.mdc) |
| Frontend componentes (estilo DW3, tooltips, modais) | [.cursor/rules/digivice-frontend-components.mdc](../.cursor/rules/digivice-frontend-components.mdc) |
| Frontend sincronização (loop TS, `StatePatcher`, store, selectors; SignalR legado do modo `compare`) | [.cursor/rules/digivice-frontend-sync.mdc](../.cursor/rules/digivice-frontend-sync.mdc) |

Fluxos passo a passo (integrações, investigações de memória, testes) ficam em `.cursor/skills/`.
