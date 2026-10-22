import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import "@/extensions/math.extensions";
import "./style.css";

import i18n from "./i18n";
import { initializeMemoryLoop } from "@/memory/loop/memory-loop.initializer";

const app = createApp(App);

app.use(createPinia());
app.use(i18n);

initializeMemoryLoop();

app.mount("#app");
