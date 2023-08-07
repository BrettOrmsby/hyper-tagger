<template>
  <Dialog
    v-model:visible="store.isSettingsOpened"
    header="Settings"
    :modal="true"
    :dismissableMask="true"
    style="margin: 0 1rem; max-width: 450px; width: 100%"
  >
    <form @submit.prevent="">
      <p>Cards:</p>
      <div
        v-for="hideTaggedCardOption in hideTaggedCardOptions"
        :key="hideTaggedCardOption.value"
        class="radio-container"
      >
        <RadioButton
          v-model="settings.hideTaggedCards"
          :inputId="'hideCards-' + hideTaggedCardOption.value"
          name="hideTags"
          :value="hideTaggedCardOption.value"
          @change="() => (store.cardIndex = 0)"
        />
        <label :for="'hideCards-' + hideTaggedCardOption.value">{{
          hideTaggedCardOption.title
        }}</label>
      </div>
      <p>Tags:</p>
      <div
        v-for="hideTagsOption in hideTagsOptions"
        :key="hideTagsOption.value"
        class="radio-container"
      >
        <RadioButton
          v-model="settings.hideTags"
          :inputId="'hideTags-' + hideTagsOption.value"
          name="hideTags"
          :value="hideTagsOption.value"
        />
        <label :for="'hideTags-' + hideTagsOption.value">{{ hideTagsOption.title }}</label>
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from "primevue/dialog";
import RadioButton from "primevue/radiobutton";
import store, { settings } from "@/lib/store";

const hideTagsOptions = [
  { title: "Show All Tags", value: "none" },
  { title: "Hide Deck-Specific Tags", value: "deckSpecific" },
  { title: "Hide Global Tags", value: "global" }
];
const hideTaggedCardOptions = [
  { title: "Show All Cards", value: "none" },
  { title: "Hide Deck-Specifically Tagged Cards", value: "deckSpecific" },
  { title: "Hide Globally Tagged Cards", value: "global" },
  { title: "Hide All Tagged Cards", value: "any" }
];
</script>

<style scoped>
p {
  font-weight: bold;
  margin-bottom: var(--inline-spacing);
  margin-top: var(--content-padding);
}
label {
  margin-left: var(--inline-spacing);
}
.radio-container {
  margin-bottom: var(--inline-spacing);
}
.radio-container:last-child {
  margin-bottom: var(--content-padding);
}
</style>
