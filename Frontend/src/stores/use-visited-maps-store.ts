import { defineStore } from "pinia";
import { ref } from "vue";

const VisitedMapsStorageKey = "digivice-visited-maps";

function loadVisitedMaps(): string[] {
  const stored = localStorage.getItem(VisitedMapsStorageKey);
  if (!stored) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export const useVisitedMapsStore = defineStore("visitedMaps", () => {
  const visitedMapIds = ref<string[]>(loadVisitedMaps());

  function recordMapVisit(mapId: string | null | undefined): void {
    if (!mapId || mapId.length === 0) {
      return;
    }

    // Ignore menus, battles, save screens, reward screens, cutscenes
    const ignoredScreens = [
      "0600",
      "0700",
      "1000",
      "0500",
      "1300",
      "1400",
      "0A00",
      "0D00",
      "0E03",
      "0F00",
      "0000",
    ];

    if (ignoredScreens.includes(mapId) || mapId.startsWith("0C")) {
      return;
    }

    if (!visitedMapIds.value.includes(mapId)) {
      visitedMapIds.value.push(mapId);
      localStorage.setItem(VisitedMapsStorageKey, JSON.stringify(visitedMapIds.value));
    }
  }

  function resetVisitedMaps(): void {
    visitedMapIds.value = [];
    localStorage.removeItem(VisitedMapsStorageKey);
  }

  return {
    visitedMapIds,
    recordMapVisit,
    resetVisitedMaps,
  };
});
