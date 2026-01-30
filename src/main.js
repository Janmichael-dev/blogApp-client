import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

// 1. Import the Toast plugin and its styles
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// 2. Define your neon-themed options
const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    // This allows you to use your neon-violet variables in the toast
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    newestOnTop: true
};

// 3. Chain the .use(Toast) before .mount("#app")
createApp(App)
  .use(router)
  .use(Toast, options)
  .mount("#app");