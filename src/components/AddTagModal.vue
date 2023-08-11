<template>
  <Dialog
    v-model:visible="store.isAddTagOpen"
    header="Tags"
    :modal="true"
    :dismissableMask="true"
    style="margin: 0 1rem; max-width: 450px; width: 100%"
  >
    <p>To add tags, type the name in and press enter.</p>
    <form @submit.prevent="">
      <label for="globalTags">Global Tags:</label>
      <Chips input-id="globalTags" v-model="store.globalTags" />
      <label for="deckSpecificTags">Deck-Specific Tags:</label>
      <Chips input-id="deckSpecificTags" v-model="store.deckSpecificTags" />
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from "primevue/dialog";
import Chips from "primevue/chips";
import store from "@/lib/store";
</script>

<style scoped>
p {
  margin-bottom: var(--content-padding);
}
label {
  display: block;
  margin-bottom: var(--inline-spacing);
  font-weight: bold;
}
.p-chips {
  margin-bottom: var(--content-padding);
  width: 100%;
}
.p-chips :deep(.p-inputtext) {
  width: 100%;
}
</style>
