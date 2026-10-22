import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import type { HealthStatus } from "@/models";
import type { ComposedState } from "@/memory/state.composer";

// Filled by the TS memory loop in compare mode; no component reads it.
export const useMemoryShadowStore = defineStore("memoryShadow", () => {
  const healthStatus = ref<HealthStatus>("Loading");
  const lastErrorCode = ref<string | null>(null);
  const lastErrorDetail = ref<string | null>(null);
  const state = shallowRef<ComposedState | null>(null);

  function setSuccess(newState: ComposedState): void {
    state.value = newState;
    healthStatus.value = "Healthy";
    lastErrorCode.value = null;
    lastErrorDetail.value = null;
  }

  function setError(code: string, detail: string | null): void {
    state.value = null;
    healthStatus.value = "Error";
    lastErrorCode.value = code;
    lastErrorDetail.value = detail;
  }

  return {
    healthStatus,
    lastErrorCode,
    lastErrorDetail,
    state,
    setSuccess,
    setError,
  };
});
