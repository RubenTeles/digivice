import type { Npc, Quest, Requisite } from "@/models";
import type { QuestAddresses } from "@/memory/addresses/journals/quest.addresses";
import type { RequisiteAddresses } from "@/memory/addresses/journals/quests/requisite.addresses";
import { AddressesRepository } from "@/memory/repositories/addresses.repository";
import type { ComposedState } from "@/memory/state.composer";

interface QuestProgress {
  doneSteps?: number[];
  doneRequisites?: string[];
}

function npc(...battles: [id: string, won: boolean][]): Npc {
  return { battles: battles.map(([id, won]) => ({ id, won })) };
}

function stepsUntil(lastStep: number): number[] {
  return Array.from({ length: lastStep }, (_, index) => index + 1);
}

function quest(addresses: QuestAddresses, progress: QuestProgress = {}): Quest {
  const doneSteps = progress.doneSteps ?? [];
  const doneRequisites = progress.doneRequisites ?? [];
  const toRequisite = (requisite: RequisiteAddresses): Requisite => ({
    id: requisite.id,
    isDone: doneRequisites.includes(requisite.id),
  });

  return {
    id: addresses.id,
    requisites: addresses.requisites.map(toRequisite),
    steps: addresses.steps.map((step) => ({
      number: step.number,
      isDone: doneSteps.includes(step.number),
      requisites: step.requisites.map(toRequisite),
    })),
  };
}

function questIn(questsAddresses: QuestAddresses[], id: string, progress?: QuestProgress): Quest {
  const addresses = questsAddresses.find((questAddresses) => questAddresses.id === id);
  if (addresses === undefined) {
    throw new Error(`Quest ${id} not found in the definitions.`);
  }

  return quest(addresses, progress);
}

const SideQuests = AddressesRepository.getAllSideQuests();
const LegendaryWeapons = AddressesRepository.getAllLegendaryWeapons();
const DriAgents = AddressesRepository.getAllDriAgents();
const DuelIsland = AddressesRepository.getAllDuelIsland();

export const FieldCentralParkExpected: ComposedState = {
  player: {
    bits: 42206,
    mapId: "021D",
    previousMapId: "1000",
    seabedRoute: null,
    mapVariant: null,
  },
  importantItems: {
    treeBoots: true,
    fishingPole: true,
    asukaTrophy: false,
    sunTrophy: false,
  },
  auctions: {
    divineBarrier: true,
    hazardShield: true,
    sniperShield: false,
    dramonShield: true,
    yinYangWand: false,
    hazardFang: false,
  },
  cardBattle: { id: null },
  digimonBattle: { field: 0, enemy: null },
  npcs: {
    genji: npc(["first", true], ["second", false]),
    natsumi: npc(["first", false]),
    catherine: npc(["first", false]),
    lucia: npc(["first", false]),
    robert: npc(["first", false]),
    akiba: npc(["first", false]),
    chris: npc(["first", false]),
    tomomi: npc(["first", false]),
    mitch: npc(["first", false]),
    bob: npc(["first", false]),
    andy: npc(["first", false]),
    george: npc(["first", false]),
    meiLin: npc(["first", false]),
    jessica: npc(["first", false]),
    gordon: npc(["first", false]),
    alice: npc(["first", false]),
    nakano: npc(["first", false]),
    seiryuLeader: npc(["first", true]),
    keith: npc(["first", true]),
    suzakuLeader: npc(["first", true]),
    fakeByakkoLeader: npc(["first", true]),
    byakkoLeader: npc(["first", true]),
    aoaAttacker: npc(["first", true]),
    optionalTrooper1AdminCenterB1F: npc(["first", false]),
    optionalTrooper2AdminCenterB1F: npc(["first", false]),
    optionalTrooperAdminFloor1: npc(["first", false]),
    optionalTrooper1AdminFloor2: npc(["first", false]),
    optionalSoldier1AdminFloor2: npc(["first", false]),
    optionalTrooper2AdminFloor2: npc(["first", false]),
  },
  journal: {
    // RAM has steps 6 and 21 unset; the main quest cascade marks them as done.
    mainQuest: quest(AddressesRepository.getMainQuest(), {
      doneSteps: stepsUntil(61),
      doneRequisites: ["tntBall"],
    }),
    sideQuests: [
      questIn(SideQuests, "fishingPole", {
        doneSteps: [1, 2, 3],
        doneRequisites: ["folderBag", "spiderWeb", "redSnapper"],
      }),
      questIn(SideQuests, "folderBag", { doneSteps: [1] }),
      questIn(SideQuests, "treeBoots", {
        doneSteps: stepsUntil(7),
        doneRequisites: ["folderBag"],
      }),
    ],
    legendaryWeapons: [
      questIn(LegendaryWeapons, "eternally", { doneSteps: [1] }),
      questIn(LegendaryWeapons, "invincible", { doneSteps: [1], doneRequisites: ["seiryuLeader"] }),
      questIn(LegendaryWeapons, "muramasa", { doneRequisites: ["smellHerb"] }),
      questIn(LegendaryWeapons, "punishment", { doneSteps: [1], doneRequisites: ["numemon"] }),
      questIn(LegendaryWeapons, "superNova", { doneRequisites: ["submarimon"] }),
    ],
    driAgents: [
      questIn(DriAgents, "driAgentAgumon", {
        doneSteps: [1, 2, 3],
        doneRequisites: ["seiryuLeader", "agumonDDNA"],
      }),
      questIn(DriAgents, "driAgentGuilmon", {
        doneSteps: [1, 2, 3],
        doneRequisites: ["seiryuLeader", "guilmonDDNA"],
      }),
      questIn(DriAgents, "driAgentKotemon", { doneSteps: [3], doneRequisites: ["submarimon"] }),
      questIn(DriAgents, "driAgentKumamon", {
        doneSteps: [1, 2, 3],
        doneRequisites: ["submarimon", "kumamonDDNA"],
      }),
      questIn(DriAgents, "driAgentMonmon", {
        doneSteps: [1, 2, 3],
        doneRequisites: ["submarimon", "monmonDDNA"],
      }),
      questIn(DriAgents, "driAgentPatamon", { doneSteps: [3], doneRequisites: ["submarimon"] }),
      questIn(DriAgents, "driAgentRenamon", { doneSteps: [3], doneRequisites: ["submarimon"] }),
      questIn(DriAgents, "driAgentVeemon", { doneRequisites: ["byakkoLeader"] }),
    ],
    duelIsland: [questIn(DuelIsland, "asukaRematch"), questIn(DuelIsland, "asukaTrophy")],
  },
};
