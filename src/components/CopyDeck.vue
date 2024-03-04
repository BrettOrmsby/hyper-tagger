<template>
  <span>Deck:</span>
  <pre>{{ deckText }}</pre>

  <Button label="Copy Deck" iconPos="left" @click="copyDeck" class="copy-button">
    <template #icon>
      <CopyClipboard class="p-icon p-button-icon p-button-icon-left" />
    </template>
  </Button>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import CopyClipboard from "./icons/CopyClipboard.vue";
import store from "@/lib/store";
import { computed } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const deckText = computed(() =>
  store.deck
    .map(
      (card) =>
        `${card.amount} ${card.name} (${card.set}) ${card.collectorNumber}${
          card.isFoil ? " *F*" : ""
        }${card.isEtched ? " *E*" : ""}${[
          ...card.globalTags.map((tag) => " #!" + tag),
          ...card.deckSpecificTags.map((tag) => " #" + tag)
        ].join("")}`
    )
    .join("\n")
);

const copyDeck = async () => {
  try {
    await navigator.clipboard.writeText(deckText.value);
    toast.add({ severity: "success", summary: "Deck Copied", life: 3000 });
  } catch (err) {
    toast.add({ severity: "error", summary: "Failed To Copy Deck", life: 3000 });
  }
};
</script>

<style scoped>
span {
  margin-bottom: var(--inline-spacing);
  display: block;
}

.copy-button {
  margin: var(--content-padding) 0;
  display: block;
}

pre {
  margin: 0;
  overflow: auto;
  max-height: 300px;
  font-family: var(--font-family);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.87);
  background: #20262e;
  padding: 0.5rem 0.75rem;
  border: 1px solid #3f4b5b;
  border-radius: 4px;
  outline-color: transparent;
}
</style>
