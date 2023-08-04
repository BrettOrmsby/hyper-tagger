<template>
  <SpeedDialMenu v-model="currentTab" />
  <main>
    <ConfirmDialogTemplate />
    <h1>Hyper Tagger</h1>
    <div v-show="currentTab === 'Enter Deck'">
      <EnterDeck @complete="() => (currentTab = 'Settings')" />
    </div>
    <div v-show="currentTab === 'Settings'">
      <TaggerSettings @complete="() => (currentTab = 'Tagger')" />
    </div>
    <div v-show="currentTab === 'Tagger'">
      <DeckTagger @complete="() => (currentTab = 'Export')" />
    </div>
    <div v-show="currentTab === 'Export'">
      <ExportDeck />
    </div>
  </main>
</template>

<script lang="ts" setup>
import EnterDeck from "./components/EnterDeck.vue";
import TaggerSettings from "./components/TaggerSettings.vue";
import DeckTagger from "./components/DeckTagger.vue";
import ConfirmDialogTemplate from "./components/ConfirmDialogTemplate.vue";
import ExportDeck from "./components/ExportDeck.vue";
import { useConfirm } from "primevue/useconfirm";
import { ref, watch } from "vue";
import store from "./lib/store";
import SpeedDialMenu from "./components/SpeedDialMenu.vue";

type Page = "Export" | "Tagger" | "Settings" | "Enter Deck";
const confirm = useConfirm();
const currentTab = ref<Page>("Enter Deck");

watch(currentTab, (newValue, oldValue) => {
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
.step {
  margin-bottom: var(--content-padding);
}
</style>
