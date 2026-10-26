import { ref } from "vue";
import {
  MainPanelSections,
  type MainPanelSection,
} from "@/ui-next/constants/main-panel-section.constant";

const activeSection = ref<MainPanelSection>("party");

function showSectionAt(offset: number): void {
  const currentIndex = MainPanelSections.indexOf(activeSection.value);
  const sectionCount = MainPanelSections.length;
  const nextIndex = (currentIndex + offset + sectionCount) % sectionCount;
  const nextSection = MainPanelSections[nextIndex];
  if (nextSection === undefined) {
    return;
  }

  activeSection.value = nextSection;
}

export function useMainPanelSection() {
  function showPrevious(): void {
    showSectionAt(-1);
  }

  function showNext(): void {
    showSectionAt(1);
  }

  return {
    activeSection,
    showPrevious,
    showNext,
  };
}
