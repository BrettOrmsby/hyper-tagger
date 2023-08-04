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
import DownloadIcon from "./icons/DownloadIcon.vue";
import PlusIcon from "./icons/PlusIcon.vue";
import MenuIcon from "./icons/MenuIcon.vue";

type Page = "Export" | "Tagger" | "Settings" | "Enter Deck";
defineProps<{ modelValue: Page }>();
const emit = defineEmits<{
  "update:modelValue": [value: Page];
}>();

const items: MenuItem[] = [
  {
    label: "Add Tag",
    vueIcon: PlusIcon,
    command: () => {
      // TODO: add global/deckSpecific tags
    }
  },
  {
    label: "Export",
    vueIcon: DownloadIcon,
    command: () => {
      emit("update:modelValue", "Export");
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
    label: "Settings",
    vueIcon: SettingsIcon,
    command: () => {
      emit("update:modelValue", "Settings");
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
