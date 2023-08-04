import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";
import "./assets/style.css";
import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import App from "./App.vue";

const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.mount("#app");
