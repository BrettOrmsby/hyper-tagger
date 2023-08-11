<template>
  <div class="flex-center">
    <Message :closable="false" severity="warn" v-if="store.deck.length === 0">
      <template #messageicon>
        <WarnIcon class="p-icon" style="margin-right: var(--inline-spacing)" />
      </template>
      Deck Is Empty</Message
    >
    <Message :closable="false" severity="warn" v-else-if="filteredDeck.length === 0">
      <template #messageicon>
        <WarnIcon class="p-icon" style="margin-right: var(--inline-spacing)" />
      </template>
      No Cards Found Matching The Criteria</Message
    >
    <div v-else class="gallery-container">
      <Button
        text
        rounded
        aria-label="Previous"
        class="gallery-button"
        @click="previous()"
        :disabled="safeCardIndex === 0"
      >
        <template #icon="data">
          <PreviousIcon :class="data.class" />
        </template>
      </Button>
      <div class="flex-center">
        <p class="card-number">{{ safeCardIndex + 1 }} / {{ filteredDeck.length }}</p>
        <CardImage :card="scryfallCard" />
        <template v-if="settings.hideTags !== 'global'">
          <h2 v-if="settings.hideTags !== 'deckSpecific'">Global</h2>
          <div class="tag-container">
            <button
              class="tag-button"
              v-for="tag of store.globalTags"
              :key="tag"
              @click="toggle('global', tag)"
            >
              <Tag :class="{ isNotTagged: !currentCard.globalTags.includes(tag) }">{{ tag }}</Tag>
            </button>
          </div>
        </template>
        <template v-if="settings.hideTags !== 'deckSpecific'">
          <h2 v-if="settings.hideTags !== 'global'">Deck Specific</h2>
          <div class="tag-container">
            <button
              class="tag-button"
              v-for="tag of store.deckSpecificTags"
              :key="tag"
              @click="toggle('deckSpecific', tag)"
            >
              <Tag
                :class="{
                  isNotTagged: !currentCard.deckSpecificTags.includes(tag)
                }"
                severity="success"
                >{{ tag }}</Tag
              >
            </button>
          </div>
        </template>
      </div>
      <Button
        text
        rounded
        aria-label="Next"
        class="gallery-button"
        @click="next()"
        :disabled="safeCardIndex === filteredDeck.length - 1"
      >
        <template #icon="data">
          <NextIcon :class="data.class" />
        </template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import Message from "primevue/message";
import Tag from "primevue/tag";
import CardImage from "./CardImage.vue";
import WarnIcon from "./icons/WarnIcon.vue";
import PreviousIcon from "./icons/PreviousIcon.vue";
import NextIcon from "./icons/NextIcon.vue";
import store, { settings } from "@/lib/store";
import { computed } from "vue";
import type { DeckCard, ScryfallCard } from "@/lib/types";
// TODO: sort the deck into instants, creatures and such before

/*
 * Filter cards out of the deck based on the settings
 */
const filteredDeck = computed(() => {
  return store.deck.filter((card) => {
    if (
      (settings.value.hideTaggedCards === "deckSpecific" ||
        settings.value.hideTaggedCards === "any") &&
      card.deckSpecificTags.length
    ) {
      return false;
    }
    if (
      (settings.value.hideTaggedCards === "global" || settings.value.hideTaggedCards === "any") &&
      card.globalTags.length
    ) {
      return false;
    }
    return true;
  });
});

// Ensure the card index is never over the filtered card index. (For example, when moving to the end of the deck and tagging that card to remove it from the filtered list)
const safeCardIndex = computed({
  get: () => {
    if (store.cardIndex > filteredDeck.value.length - 1) {
      return filteredDeck.value.length - 1;
    } else if (store.cardIndex < 0) {
      return 0;
    }
    return store.cardIndex;
  },
  set: (value) => {
    store.cardIndex = value;
  }
});

/*
 * Get the card in the deck based on what is shown
 */
const currentCard = computed(() => {
  return store.deck.find((card) => {
    const filteredCard = filteredDeck.value[safeCardIndex.value];
    return card.set === filteredCard.set && card.collectorNumber === filteredCard.collectorNumber;
  }) as DeckCard;
});

/*
 * Get the scryfall card from what is shown
 */
const scryfallCard = computed(() => {
  const deckCard = filteredDeck.value[safeCardIndex.value];
  return store.scryfallCards.find(
    (card) =>
      card.set === deckCard.set.toLowerCase() && card.collector_number === deckCard.collectorNumber
  ) as ScryfallCard;
});

/*
 * Add or remove a tag from the current card
 */
const toggle = (tagType: "global" | "deckSpecific", tag: string) => {
  const card = currentCard.value;
  const tagGroup = tagType === "global" ? "globalTags" : "deckSpecificTags";
  if (card[tagGroup].includes(tag)) {
    card[tagGroup].splice(card[tagGroup].indexOf(tag), 1);
  } else {
    card[tagGroup].push(tag);
  }
  store.isTagsEdited = true;
};

const next = () => (safeCardIndex.value += 1);
const previous = () => (safeCardIndex.value -= 1);
</script>

<style scoped>
.gallery-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
/* styles copied from primevue carousel buttons: https://primevue.org/carousel/*/
.gallery-button {
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem !important;
  color: rgba(255, 255, 255, 0.6);
  background: transparent !important;
  border-radius: 50%;
  transition:
    color 0.15s,
    box-shadow 0.15s;
  margin: 0.5rem;
  padding: 0;
  align-self: center;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}
.gallery-button:hover,
.gallery-button:active {
  color: rgba(255, 255, 255, 0.87) !important;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.p-message {
  width: 100%;
}
.card-number {
  margin: 0;
  margin-bottom: var(--inline-spacing);
  color: var(--text-color-secondary);
}
.card-image {
  max-width: 100%;
  max-height: 500px;
  margin-bottom: var(--content-padding);
}

h2 {
  margin: 0 0 var(--inline-spacing) 0;
  font-size: 1rem;
}
.tag-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--inline-spacing);
  margin-bottom: var(--content-padding);
}
.tag-button {
  all: unset;
  cursor: pointer;
}
.tag-button > .p-tag {
  transition: 0.1s ease-in-out;
}
.isNotTagged {
  opacity: 0.6;
}
</style>
