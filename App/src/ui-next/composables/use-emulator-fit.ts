import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  EmulatorWindowService,
  type EmulatorArea,
} from "@/presentation/services/emulator-window.service";
import type { EmulatorWindowErrorCode } from "@/shared/constants/emulator-window-error-code.constant";

const RefitDelayMs = 200;
const TitleBarResizeTimeoutMs = 500;

// Shared by EmulatorSlot (measured area, errors), Footer (toggle) and modals (cut suspension).
const isFitted = ref(false);
const isFitting = ref(false);
const errorCode = ref<EmulatorWindowErrorCode | null>(null);
let slotElement: HTMLElement | null = null;
// Counter so stacked modals keep the cut suspended until the last one closes.
let suspensionCount = 0;
let hasPendingRefit = false;

function measure(element: HTMLElement): EmulatorArea {
  // Rounding the edges (not the size) keeps the slot gap-free at fractional DPI scales.
  const bounds = element.getBoundingClientRect();
  const scale = window.devicePixelRatio;
  const left = Math.round(bounds.left * scale);
  const top = Math.round(bounds.top * scale);
  const right = Math.round(bounds.right * scale);
  const bottom = Math.round(bounds.bottom * scale);

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function waitForWindowResize(): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      window.removeEventListener("resize", finish);
      clearTimeout(timeout);
      resolve();
    };
    const timeout = setTimeout(finish, TitleBarResizeTimeoutMs);
    window.addEventListener("resize", finish);
  });
}

// A window with a region falls back to the classic (pre-DWM) title bar, so it is hidden while fitted.
async function hideTitleBar(): Promise<void> {
  const resized = waitForWindowResize();
  await getCurrentWindow().setDecorations(false);
  await resized;
}

async function showTitleBar(): Promise<void> {
  await getCurrentWindow().setDecorations(true);
}

async function release(): Promise<void> {
  if (!isFitted.value) {
    return;
  }

  isFitted.value = false;
  hasPendingRefit = false;
  await EmulatorWindowService.release();
  await showTitleBar();
}

async function fit(): Promise<void> {
  if (slotElement === null || isFitting.value) {
    return;
  }

  const wasFitted = isFitted.value;
  isFitting.value = true;

  // The slot grows once the title bar is gone, so it is measured only afterwards.
  if (!wasFitted) {
    await hideTitleBar();
  }

  errorCode.value = await EmulatorWindowService.fit(measure(slotElement));
  isFitting.value = false;

  if (errorCode.value === null) {
    isFitted.value = true;

    // A refit that lands while a modal is open must not cut the modal.
    if (suspensionCount > 0) {
      await EmulatorWindowService.suspendCut();
    }

    return;
  }

  if (wasFitted) {
    await release();
    return;
  }

  await showTitleBar();
}

async function suspendCut(): Promise<void> {
  suspensionCount += 1;
  if (suspensionCount === 1 && isFitted.value) {
    await EmulatorWindowService.suspendCut();
  }
}

async function resumeCut(): Promise<void> {
  if (suspensionCount === 0) {
    return;
  }

  suspensionCount -= 1;
  if (suspensionCount > 0 || !isFitted.value || slotElement === null) {
    return;
  }

  // The window changed size while suspended, so DuckStation has to follow the slot too.
  if (hasPendingRefit) {
    hasPendingRefit = false;
    await fit();
    return;
  }

  await EmulatorWindowService.resumeCut(measure(slotElement));
}

export function useEmulatorSlot(slotElementRef: Readonly<Ref<HTMLElement | null>>) {
  let resizeObserver: ResizeObserver | null = null;
  let stopMovedListener: (() => void) | null = null;
  let refitTimer: ReturnType<typeof setTimeout> | undefined;
  let isUnmounted = false;

  function scheduleRefit(): void {
    if (!isFitted.value) {
      return;
    }

    if (suspensionCount > 0) {
      hasPendingRefit = true;
      return;
    }

    clearTimeout(refitTimer);
    refitTimer = setTimeout(() => void fit(), RefitDelayMs);
  }

  onMounted(async () => {
    slotElement = slotElementRef.value;
    if (slotElement !== null) {
      resizeObserver = new ResizeObserver(scheduleRefit);
      resizeObserver.observe(slotElement);
    }

    const stopListener = await getCurrentWindow().onMoved(scheduleRefit);
    if (isUnmounted) {
      stopListener();
      return;
    }

    stopMovedListener = stopListener;
  });

  // Leaving the new screen (F3 or Error) must not leave a hole in the old one.
  onUnmounted(() => {
    isUnmounted = true;
    resizeObserver?.disconnect();
    stopMovedListener?.();
    clearTimeout(refitTimer);
    slotElement = null;
    void release();
  });

  return {
    errorCode,
  };
}

export function useEmulatorToggle() {
  async function toggle(): Promise<void> {
    if (isFitted.value) {
      await release();
      return;
    }

    await fit();
  }

  return {
    isFitted,
    isFitting,
    toggle,
  };
}

/** Keeps the Digivice window rectangular while `isActive` (e.g. a modal's isOpen) is true. */
export function useEmulatorCutSuspension(isActive: Readonly<Ref<boolean>>) {
  watch(isActive, (active) => {
    if (active) {
      void suspendCut();
      return;
    }

    void resumeCut();
  });

  onUnmounted(() => {
    if (isActive.value) {
      void resumeCut();
    }
  });
}
