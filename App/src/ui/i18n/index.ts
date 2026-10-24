import { watch } from "vue";
import { createI18n } from "vue-i18n";
import enUS from "./en-US";
import ptBR from "./pt-BR";

// Saved choice first, then the system language.
const savedLocale = localStorage.getItem("user-locale");
const browserLocale = navigator.language;
const defaultLocale = savedLocale || (browserLocale.startsWith("pt") ? "pt-BR" : "en-US");

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: "en-US",
  messages: {
    "en-US": enUS,
    "pt-BR": ptBR,
  },
});

watch(
  i18n.global.locale,
  (locale) => {
    document.documentElement.lang = locale;
  },
  { immediate: true },
);

export default i18n;
