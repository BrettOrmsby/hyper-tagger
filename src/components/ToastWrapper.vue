<template>
  <Toast>
    <template #message="slotProps">
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
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
</template>

<script lang="ts" setup>
import WarnIcon from "@/components/icons/WarnIcon.vue";
import CheckIcon from "@/components/icons/CheckIcon.vue";
import XCircleIcon from "@/components/icons/XCircleIcon.vue";
import Toast from "primevue/toast";
</script>

<style scoped></style>
