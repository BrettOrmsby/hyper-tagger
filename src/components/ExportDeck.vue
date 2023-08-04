<template>
  <Message :closable="false" severity="warn" v-if="store.deck.length === 0">
    <template #messageicon>
      <WarnIcon class="p-icon" style="margin-right: var(--inline-spacing)" />
    </template>
    Deck Is Empty</Message
  >
  <div v-else>
    <Textarea :value="deck" rows="10" />
    <Button label="Copy" @click="copy(deck)" />
  </div>
</template>

<script lang="ts" setup>
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import WarnIcon from "./icons/WarnIcon.vue";
import store from "@/lib/store";
import { computed } from "vue";
//TODO: show that it is copies

/*
 * Convert the deck object to a string
 */
const deck = computed(() =>
  store.deck
    .map(
      (card) =>
        `${card.amount} ${card.name} (${card.set}) ${card.collectorNumber}${
          card.isFoil ? " *F*" : ""
        }${[
          ...card.globalTags.map((tag) => " #!" + tag),
          ...card.deckSpecificTags.map((tag) => " #" + tag)
        ].join("")}`
    )
    .join("\n")
);

/*
 * Copy text
 */
const copy = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};
</script>

<style scoped>
.p-inputtextarea {
  resize: none;
  width: 100%;
  display: block;
  margin-bottom: var(--inline-spacing);
}
</style>
