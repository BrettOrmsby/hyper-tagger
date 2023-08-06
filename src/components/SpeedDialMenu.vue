<template>
  <span>
    <SpeedDial
      :model="items"
      direction="up"
      :style="{
        position: 'fixed',
        left: 'var(--inline-spacing)',
        bottom: 'var(--inline-spacing)',
        'z-index': '1001',
        'pointer-events': 'none'
      }"
    >
      <template #item="slotProps">
        <a
          tabindex="-1"
          href="#"
          role="menuitem"
          class="p-speeddial-action"
          aria-label="Enter Deck"
          @click="slotProps.onClick"
        >
          <component :is="slotProps.item.vueIcon" class="pi" />
        </a>
      </template>
      <template #icon="slotProps">
        <PlusIcon v-if="slotProps.visible" class="p-icon" />
        <MenuIcon v-else class="p-icon" />
      </template> </SpeedDial
  ></span>
</template>

<script lang="ts" setup>
import type { MenuItem } from "primevue/menuitem";
import SpeedDial from "primevue/speeddial";
import PenIcon from "./icons/PenIcon.vue";
import SettingsIcon from "./icons/SettingsIcon.vue";
import TagsIcon from "./icons/TagsIcon.vue";
import CopyClipboard from "./icons/CopyClipboard.vue";
import PlusIcon from "./icons/PlusIcon.vue";
import MenuIcon from "./icons/MenuIcon.vue";
import store from "@/lib/store";
import { useToast } from "primevue/usetoast";

const toast = useToast();

type Page = "Tagger" | "Enter Deck";
defineProps<{ modelValue: Page }>();
const emit = defineEmits<{
  "update:modelValue": [value: Page];
}>();

const items: MenuItem[] = [
  {
    label: "Add Tag",
    vueIcon: PlusIcon,
    command: () => {
      store.isAddTagOpen = true;
    }
  },
  {
    label: "Settings",
    vueIcon: SettingsIcon,
    command: () => {
      store.isSettingsOpened = true;
    }
  },
  {
    label: "Copy",
    vueIcon: CopyClipboard,
    command: async () => {
      const deck = store.deck
        .map(
          (card) =>
            `${card.amount} ${card.name} (${card.set}) ${card.collectorNumber}${
              card.isFoil ? " *F*" : ""
            }${[
              ...card.globalTags.map((tag) => " #!" + tag),
              ...card.deckSpecificTags.map((tag) => " #" + tag)
            ].join("")}`
        )
        .join("\n");
      try {
        await navigator.clipboard.writeText(deck);
        toast.add({ severity: "success", summary: "Deck Copied", life: 3000 });
      } catch (err) {
        toast.add({ severity: "error", summary: "Failed To Copy Deck", life: 3000 });
      }
    }
  },
  {
    label: "Tagger",
    vueIcon: TagsIcon,
    command: () => {
      emit("update:modelValue", "Tagger");
    }
  },
  {
    label: "Enter Deck",
    vueIcon: PenIcon,
    command: () => {
      emit("update:modelValue", "Enter Deck");
    }
  }
];
</script>

<style scoped>
:deep(.p-button) {
  pointer-events: all;
}
</style>
