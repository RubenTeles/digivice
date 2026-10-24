# Journal Quest — Pipeline

## Data flow

```
memory/definitions/Quests/**/*.json
  → AddressesRepository (getMainQuest / getAll{Category}, import.meta.glob ordered by file name)
  → JournalProvider → JournalReader → QuestReader (snapshot) → JournalResource
  → JournalAssembler → QuestAssembler | MainQuestAssembler | DuelIslandAssembler
  → State.journal (StateComposer, every tick)
  → useGameStore.applyState → StatePatcher (lists keyed by id / number)

useGameState().journal
  → JournalPresenter
  → QuestRepository (static JSON Raw)
  → QuestModalPresenter + presenters/converter/QuestConverter
  → JournalViewModel
  → Journal.vue → JournalQuestsSection + JournalQuestCard
  → QuestModal (on card click)
```

## Key paths

Paths under `Frontend/src/`.

| Concern | Path |
|---------|------|
| Definitions | `memory/definitions/Quests/` |
| Addresses types | `memory/addresses/journal.addresses.ts`, `memory/addresses/journals/` |
| Addresses converter | `memory/converters/journals/quest-addresses.converter.ts` |
| Addresses repository | `memory/repositories/addresses.repository.ts` |
| Readers | `memory/readers/journal.reader.ts`, `memory/readers/quest.reader.ts` |
| Resources | `memory/resources/journal.resource.ts`, `memory/resources/journals/` |
| Assemblers | `memory/assemblers/journal.assembler.ts`, `quest.assembler.ts`, `main-quest.assembler.ts`, `duel-island.assembler.ts` |
| Provider | `memory/providers/journal.provider.ts` |
| Patcher list keys | `memory/patch/state.patcher.ts` (`ListKeys`) |
| Models | `models/journal/` |
| Static JSON | `database/quest/` |
| Static repository | `repositories/quest.repository.ts` |
| Table types | `repositories/tables/quest/` |
| Raw types | `repositories/tables/raws/quest/` |
| Presenters | `presenters/journal/` |
| Presenter converters | `presenters/converter/` |
| ViewModels | `viewmodels/quest/` |
| Journal UI | `components/journal/` |
| Section palette | `components/journal/journal-section-palette.ts` |
| i18n journal | `i18n/locales/{en-US,pt-BR}/journal.json` |
| i18n quests | `i18n/locales/{en-US,pt-BR}/quest/` |

## Two converter contexts (do not mix)

| Context | Folder | Direction |
|---------|--------|-----------|
| Definitions | `memory/converters/` | definitions `Raw` (PascalCase JSON) → `*Addresses` |
| Static/UI | `presenters/converter/` | static `Raw` + `Model` → `ViewModel` |

## Side quests reference (copy pattern)

| Layer | Reference |
|-------|-----------|
| Definitions | `memory/definitions/Quests/SideQuests/` |
| Repository getter | `AddressesRepository.getAllSideQuests()` |
| Reader / assembler | `sideQuests` in `journal.reader.ts` / `journal.assembler.ts` |
| Model field | `Journal.sideQuests` |
| Patcher key | `sideQuests: "id"` |
| Static getter | `getSideQuestsRaw()` |
| Presenter | `journal.presenter.ts` side-quest map |
| Modal resolve | `quest-modal.presenter.ts` side-quest branch |
| UI section | `JournalQuestsSection` + `accent-color="emerald"` |

## Aside section order

1. Main quest (inline yellow section)
2. Auction
3. Side quests
4. Legendary weapons
5. DRI agents
6. Duel Island

## Section invariant

A collapsible section is wired only when the category has **at least one quest**
(definitions + static JSON). Empty sections are not supported.
