# Integration Status

Maintained by the journal-quest-integration skill. Append entries; do not remove without reason.
Definitions paths are relative to `Frontend/src/memory/definitions/`.

## Categories on Journal

| Category | Assembler | Accent | Reference quest |
|----------|-----------|--------|-----------------|
| Main quest | `MainQuestAssembler` | Yellow (hardcoded) | mainQuest |
| Side quests | `QuestAssembler` | `emerald` | folderBag |
| Legendary weapons | `QuestAssembler` | `teal` | eternally |
| DRI agents (8/8 rookies) | `QuestAssembler` | `cyan` | driAgentGuilmon |
| Duel Island | `DuelIslandAssembler` | `sky` | asukaTrophy |

## Quests integrated

### Side quests

- `folderBag` — `Quests/SideQuests/FolderBagAddresses.json`
- `fishingPole` — `Quests/SideQuests/FishingPoleAddresses.json` (quest-level requisite `folderBag`)
- `treeBoots` — `Quests/SideQuests/TreeBootsAddresses.json` (quest-level requisite `folderBag`)

### Legendary weapons (2026-06-06)

- `eternally` — `Quests/LegendaryWeapons/EternallyAddresses.json` (`0x4B38E` `0x01`)
- `invincible` — `Quests/LegendaryWeapons/InvincibleAddresses.json` (`0x4B38E` `0x02`; quest-level requisite `seiryuLeader`)
- `muramasa` — `Quests/LegendaryWeapons/MuramasaAddresses.json` (`0x4B38E` `0x04`; quest-level requisite `smellHerb`)

### Legendary weapons (2026-07-14)

- `superNova` — `Quests/LegendaryWeapons/SuperNovaAddresses.json` (`0x4B38E` `0x08`; quest-level requisite `submarimon`); coords provisórias (`021C` / 50,50)
- `punishment` — `Quests/LegendaryWeapons/PunishmentAddresses.json` (`0x4B38E` `0x10`; quest-level requisite `numemon`); coords provisórias (`0252` / 50,50)

### DRI agents (2026-06-06)

- `driAgentGuilmon` — `Quests/DriAgents/DriAgentGuilmonAddresses.json` (3 steps + `guilmonDDNA` requisite; quest-level requisite `seiryuLeader`)
- `driAgentAgumon` — `Quests/DriAgents/DriAgentAgumonAddresses.json` (3 steps + `agumonDDNA` requisite; quest-level requisite `seiryuLeader`)
- `driAgentVeemon` — `Quests/DriAgents/DriAgentVeemonAddresses.json` (3 steps + `veemonDDNA` requisite; quest-level requisite `byakkoLeader`)

### DRI agents (2026-07-12)

- `driAgentKumamon` — `Quests/DriAgents/DriAgentKumamonAddresses.json` (3 steps + `kumamonDDNA` requisite; quest-level requisite `submarimon`)
- `driAgentMonmon` — `Quests/DriAgents/DriAgentMonmonAddresses.json` (3 steps + `monmonDDNA` requisite; quest-level requisite `submarimon`)

### DRI agents (2026-07-13)

- `driAgentKotemon` — `Quests/DriAgents/DriAgentKotemonAddresses.json` (3 steps + `kotemonDDNA` requisite; quest-level requisite `submarimon`)
- `driAgentRenamon` — `Quests/DriAgents/DriAgentRenamonAddresses.json` (3 steps + `renamonDDNA` requisite; quest-level requisite `submarimon`)

### DRI agents (2026-07-14)

- `driAgentPatamon` — `Quests/DriAgents/DriAgentPatamonAddresses.json` (3 steps + `patamonDDNA` requisite; quest-level requisite `submarimon`); coords provisórias (`021D` / `0247` / 50,50)

### Duel Island (2026-08-30)

- `asukaTrophy` — `Quests/DuelIsland/AsukaTrophyAddresses.json`; coords provisórias (`0228` / 50,50)

### Duel Island (2026-08-31)

- `asukaRematch` — `Quests/DuelIsland/AsukaRematchAddresses.json` (quest-level requisite `asukaTrophy`; step 6 provisional = step 5 bit `0x4B3B3` / `0x08`); coords provisórias (`0228` / 50,50)

## Palette notes

- `emerald` — side quests
- `teal` — legendary weapons
- `cyan` — DRI agents
- `sky` — Duel Island
