import { onUnmounted, ref, watch } from "vue";

// Fixed on Asuka until the server value is found in RAM.
const isAmaterasu = ref(false);

/** Applies the theme on <html> so teleported modals inherit it too. */
export function useServerThemeRoot() {
  const stopWatch = watch(
    isAmaterasu,
    (amaterasu) => {
      document.documentElement.dataset.server = amaterasu ? "amaterasu" : "asuka";
    },
    { immediate: true },
  );

  // Leaving the new screen (F3) must not tint the old one.
  onUnmounted(() => {
    stopWatch();
    delete document.documentElement.dataset.server;
  });
}
