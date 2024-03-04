<template>
  <div>
    <ToastWrapper />
    <SettingsModal />
    <AddTagModal />
    <main>
      <ConfirmDialogTemplate />
      <h1 class="with-greeting">
        <img :src="imageUrl" class="logo" />
        Hyper Tagger
      </h1>
      <p class="greeting">
        Need to tag your
        <a href="https://www.moxfield.com/" target="_blank">Moxfield</a> deck? Want to save time?
        Don't have a computer with you? Try this!
      </p>
      <Stepper v-model:activeStep="stepperTab" linear>
        <StepperPanel header="Enter Deck">
          <template #content="{ nextCallback }">
            <EnterDeck @complete="nextCallback($event)" />
            <HelpSection />
          </template>
        </StepperPanel>
        <StepperPanel header="Tagger">
          <template #content="{ prevCallback, nextCallback }">
            <DeckTagger />
            <div class="button-container">
              <Button
                label="Back"
                severity="secondary"
                @click="checkSwitchBackToEnterTab(prevCallback)"
              />
              <Button label="Next" @click="nextCallback" />
            </div>
          </template>
        </StepperPanel>
        <StepperPanel header="Copy Deck">
          <template #content="{ prevCallback }">
            <CopyDeck />
            <div class="button-container">
              <Button label="Back" severity="secondary" @click="prevCallback" />
              <Button label="Start Over" @click="startOver" />
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </main>
  </div>
</template>

<script lang="ts" setup>
import EnterDeck from "./components/EnterDeck.vue";
import HelpSection from "./components/HelpSection.vue";
import SettingsModal from "./components/SettingsModal.vue";
import DeckTagger from "./components/DeckTagger.vue";
import ConfirmDialogTemplate from "./components/ConfirmDialogTemplate.vue";
import ToastWrapper from "./components/ToastWrapper.vue";
import AddTagModal from "./components/AddTagModal.vue";
import CopyDeck from "./components/CopyDeck.vue";
import Button from "primevue/button";
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import store from "./lib/store";
import imageUrl from "@/assets/logo.svg";
import { useConfirm } from "primevue/useconfirm";
import { ref } from "vue";

const confirm = useConfirm();

const stepperTab = ref(0);

const checkSwitchBackToEnterTab = (change: (event: Event) => void) => {
  if (!store.isTagsEdited) {
    change(new Event("change"));
    return;
  }
  confirm.require({
    group: "template",
    message: "Are you sure you want to leave. Your changes will not be saved.",
    header: "Warning",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    accept: () => {
      change(new Event("change"));
    },
    reject: () => {}
  });
};

const startOver = () => {
  confirm.require({
    group: "template",
    message: "Are you sure you want to leave. You will not be able to copy your deck.",
    header: "Warning",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    accept: () => {
      stepperTab.value = 0;
      console.log(stepperTab.value);
    },
    reject: () => {}
  });
};
</script>

<style scoped>
.logo {
  height: 1em;
  width: 1em;
  vertical-align: middle;
}
.with-greeting {
  margin-bottom: var(--inline-spacing);
}
.greeting {
  margin-top: 0;
  color: var(--text-color-secondary);
}
.button-container button + button {
  margin-left: var(--inline-spacing);
}
</style>
./components/TaggerSpeedDial.vue
