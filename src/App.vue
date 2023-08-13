<template>
  <div>
    <ToastWrapper />
    <SettingsModal />
    <AddTagModal />
    <SpeedDialMenu v-model="currentTab" />
    <main>
      <ConfirmDialogTemplate />
      <div v-show="currentTab === 'Enter Deck'">
        <h1 class="with-greeting">
          <img :src="imageUrl" class="logo" />
          Hyper Tagger
        </h1>
        <p class="greeting">
          Need to tag your <a href="https://www.moxfield.com/" target="_blank">Moxfield</a> deck?
          Want to save time? Don't have a computer with you? Try this!
        </p>
        <EnterDeck @complete="() => (currentTab = 'Tagger')" />
        <HelpSection />
      </div>
      <div v-show="currentTab === 'Tagger'">
        <h1>
          <img :src="imageUrl" class="logo" />
          Hyper Tagger
        </h1>
        <DeckTagger />
      </div>
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
import SpeedDialMenu from "./components/SpeedDialMenu.vue";
import AddTagModal from "./components/AddTagModal.vue";
import imageUrl from "@/assets/logo.svg";
import { useConfirm } from "primevue/useconfirm";
import { ref, watch } from "vue";
import store from "./lib/store";

type Page = "Tagger" | "Enter Deck";
const confirm = useConfirm();
const currentTab = ref<Page>("Enter Deck");

watch(currentTab, (_newValue, oldValue) => {
  if (oldValue === "Enter Deck" && store.isDeckEdited) {
    confirm.require({
      group: "template",
      message:
        "Your deck was edited but not loaded. Do you want to continue without loading your new deck?",
      header: "Warning",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
      accept: () => {},
      reject: () => {
        currentTab.value = "Enter Deck";
      }
    });
  }
});
</script>

<style scoped>
.logo {
  height: 1em;
  width: 1em;
  vertical-align: middle;
}
.step {
  margin-bottom: var(--content-padding);
}
.with-greeting {
  margin-bottom: var(--inline-spacing);
}
.greeting {
  margin-top: 0;
  color: var(--text-color-secondary);
}
</style>
