import { ref, type Ref } from "vue";
import { EmulatorWindowService } from "@/presentation/services/emulator-window.service";
import type { EmulatorWindowErrorCode } from "@/shared/constants/emulator-window-error-code.constant";

export function useEmulatorFit(slotElement: Readonly<Ref<HTMLElement | null>>) {
  const errorCode = ref<EmulatorWindowErrorCode | null>(null);
  const isFitting = ref(false);

  async function fit(): Promise<void> {
    const element = slotElement.value;
    if (element === null || isFitting.value) {
      return;
    }

    // Rounding the edges (not the size) keeps the slot gap-free at fractional DPI scales.
    const bounds = element.getBoundingClientRect();
    const scale = window.devicePixelRatio;
    const left = Math.round(bounds.left * scale);
    const top = Math.round(bounds.top * scale);
    const right = Math.round(bounds.right * scale);
    const bottom = Math.round(bounds.bottom * scale);

    isFitting.value = true;
    errorCode.value = await EmulatorWindowService.fit({
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    });
    isFitting.value = false;
  }

  return {
    fit,
    errorCode,
    isFitting,
  };
}
