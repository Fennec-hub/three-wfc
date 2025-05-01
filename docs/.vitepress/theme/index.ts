// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import { type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { OhVueIcon } from "./icons";
import FloatingVue from "floating-vue";
import "./styles/global.css";
import "floating-vue/dist/style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("v-icon", OhVueIcon);
    app.use(FloatingVue);
  },
} satisfies Theme;
