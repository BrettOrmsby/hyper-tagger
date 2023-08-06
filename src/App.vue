<template>
  <div>
    <Toast>
      <template #message="slotProps">
        <div
          style="display: flex; align-items: center; justify-content: space-between; width: 100%"
        >
          <CheckIcon
            v-if="slotProps.message.severity === 'success'"
            class="p-icon p-toast-message-icon"
          />
          <WarnIcon
            v-else-if="slotProps.message.severity === 'warn'"
            class="p-icon p-toast-message-icon"
          />
          <XCircleIcon
            v-else-if="slotProps.message.severity === 'error'"
            class="p-icon p-toast-message-icon"
          />
          <p class="p-toast-message-text">{{ slotProps.message.summary }}</p>
        </div>
      </template>
    </Toast>
    <SettingsModal />
    <SpeedDialMenu v-model="currentTab" />
    <main>
      <ConfirmDialogTemplate />
      <h1>Hyper Tagger</h1>
      <div v-show="currentTab === 'Enter Deck'">
        <EnterDeck @complete="() => (currentTab = 'Tagger')" />
      </div>
      <div v-show="currentTab === 'Tagger'">
        <DeckTagger />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import EnterDeck from "./components/EnterDeck.vue";
import SettingsModal from "./components/SettingsModal.vue";
import DeckTagger from "./components/DeckTagger.vue";
import ConfirmDialogTemplate from "./components/ConfirmDialogTemplate.vue";
import SpeedDialMenu from "./components/SpeedDialMenu.vue";
import WarnIcon from "./components/icons/WarnIcon.vue";
import CheckIcon from "./components/icons/CheckIcon.vue";
import XCircleIcon from "./components/icons/XCircleIcon.vue";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { ref, watch } from "vue";
import store from "./lib/store";

type Page = "Tagger" | "Enter Deck";
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
