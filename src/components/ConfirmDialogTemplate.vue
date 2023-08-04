<template>
  <ConfirmDialog group="template" style="margin: 0 1rem; max-width: 450px">
    <template #message="slotProps">
      <div class="message-container">
        <span class="icon-container" v-html="slotProps.message.icon"></span>
        <p>{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script lang="ts" setup>
import ConfirmDialog from "primevue/confirmdialog";
</script>

<style scoped>
.message-container {
  display: flex;
  align-items: center;
}
.icon-container {
  font-size: 2rem;
  display: flex;
  align-items: center;
  margin-right: var(--inline-spacing);
}
</style>
