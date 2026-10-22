import type { Npc } from "@/models";
import type { ComposedState } from "@/memory/state.composer";

function npc(...battles: [id: string, won: boolean][]): Npc {
  return { battles: battles.map(([id, won]) => ({ id, won })) };
}

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
};
