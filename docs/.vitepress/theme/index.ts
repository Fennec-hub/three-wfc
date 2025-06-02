// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import { type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { OhVueIcon } from "./icons";
import FloatingVue from "floating-vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./styles/global.css";
import "floating-vue/dist/style.css";

const toastDefaultOptions = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: "top-center",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
};

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app }) {
    app.component("v-icon", OhVueIcon);
    app.use(FloatingVue);
    app.use(Toast, toastDefaultOptions);
  },
} satisfies Theme;
