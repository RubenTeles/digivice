import { signalRLogger, signalRService } from "./signalr.service";
import { useCSharpShadowStore } from "@/stores/use-csharp-shadow-store";

/**
 * Initializes the SignalR handlers to bridge incoming backend events with the C# shadow store actions.
 */
export function initializeSignalRHandlers(): void {
  const store = useCSharpShadowStore();

  signalRService.on("HubConnectionStatusChanged", (data) => {
    store.syncHubConnectionStatus(data);
  });

  signalRService.on("HealthChanged", (data) => {
    store.syncHealth(data);
  });

  signalRService.on("InitialState", (data) => {
    store.setInitialState(data);
  });

  signalRService.on("PlayerChanged", (data) => {
    store.syncPlayer(data);
  });

  signalRService.on("ImportantItemsChanged", (data) => {
    store.syncImportantItems(data);
  });

  signalRService.on("PartyChanged", (data) => {
    store.syncParty(data);
  });

  signalRService.on("DigimonBattleChanged", (data) => {
    store.syncDigimonBattle(data);
  });

  signalRService.on("CardBattleChanged", (data) => {
    store.syncCardBattle(data);
  });

  signalRService.on("AuctionsChanged", (data) => {
    store.syncAuctions(data);
  });

  signalRService.on("NpcsChanged", (data) => {
    store.syncNpcs(data);
  });

  signalRService.on("JournalChanged", (data) => {
    store.syncJournal(data);
  });

  signalRLogger.debug("SignalR Handlers successfully initialized.");
}
