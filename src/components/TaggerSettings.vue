<template>
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

    <div class="switch-container">
      <label for="multiselect">Multiselect Tags: </label>
      <InputSwitch inputId="multiselect" v-model="settings.allowMultiselect" />
    </div>
  </form>
  <Button label="Start Tagging" @click="emit('complete')" />
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import RadioButton from "primevue/radiobutton";
import InputSwitch from "primevue/inputswitch";
import store, { settings } from "@/lib/store";
const emit = defineEmits<{
  complete: [];
}>();

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
.switch-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: var(--content-padding);
}
.switch-container label {
  margin-left: 0;
  margin-right: var(--inline-spacing);
}
</style>
