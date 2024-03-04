<template>
  <label for="deck">Deck: </label>
  <Textarea
    v-model="deck"
    rows="10"
    id="deck"
    :class="{ 'p-invalid': errorMessages.length > 0 }"
    placeholder="1 Live Fast (KLD) 87 *F* #!Global #Deck-Specific"
  />
  <div class="error-messages" v-if="errorMessages.length > 0">
    <p v-for="(errorMessage, index) of errorMessages" :key="index">
      {{ errorMessage }}
    </p>
  </div>
  <Button label="Load Deck" icon-pos="left" :loading="isLoading" @click="loadDeck">
    <template #icon="slotProps">
      <PenIcon :class="slotProps.class" />
    </template>
    <template #loadingicon="slotProps">
      <LoadIcon :class="slotProps.class + ' p-icon-spin'" />
    </template>
  </Button>
</template>

<script lang="ts" setup>
// TODO: it does not work when hiding global tags but tagging with deck specific tags that are the same name as the hidden global tag (ie #!interaction will not work to apply the new tag #interaction)
// TODO: Star of Extinction (MB1) 1068 does not work
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import PenIcon from "@/components/icons/PenIcon.vue";
import LoadIcon from "@/components/icons/LoadIcon.vue";
import type { DeckCard, ScryfallCard } from "@/lib/types";
import { convertStreamToString } from "@/lib/utils";
import store from "@/lib/store";
import { ref } from "vue";

const emit = defineEmits<{
  complete: [Event];
}>();
type ScryfallIdentifier = { set: string; collector_number: string };

const deck = ref("1 Live Fast (KLD) 87 *F* #!Global #Deck-Specific");
const isLoading = ref(false);
const errorMessages = ref<string[]>([]);

/*
 * Load the deck into the tagger
 */
const loadDeck = async () => {
  errorMessages.value = [];
  isLoading.value = true;

  // Convert the deck to an object
  const { cards: deckCards, errors } = deckToJson(deck.value);
  if (errors.length > 0) {
    errors.forEach((errorLine) =>
      errorMessages.value.push(
        `Formatting Error on line ${errorLine + 1}: ${deck.value.split("\n")[errorLine]} `
      )
    );
    isLoading.value = false;
    return;
  }

  // Get the scryfall data from the deck
  const { error, cards, notFound } = await loadScryfallData(deckCards);
  if (error) {
    errorMessages.value.push("Loading Error, try loading the deck again.");
    return;
  }

  // Display the missing cards
  notFound.forEach((identifier) => {
    for (let i = 0; i < deckCards.length; i++) {
      const card = deckCards[i];
      if (card.set === identifier.set && card.collectorNumber === identifier.collector_number) {
        errorMessages.value.push(
          `Invalid Card Error on line ${
            i + 1
          }, ensure the card set and collector number is correct: ${deck.value.split("\n")[i]} `
        );
        break;
      }
    }
  });

  isLoading.value = false;

  if (notFound.length === 0) {
    store.deck = sortDeck(deckCards, cards);
    store.scryfallCards = cards;
    store.isTagsEdited = false;
    store.cardIndex = 0;
    const globalTags = new Set<string>();
    const deckSpecificTags = new Set<string>();
    deckCards.forEach((deckCard) => {
      deckCard.globalTags.forEach((tag) => globalTags.add(tag));
      deckCard.deckSpecificTags.forEach((tag) => deckSpecificTags.add(tag));
    });
    store.globalTags = [...globalTags];
    store.deckSpecificTags = [...deckSpecificTags];
    emit("complete", new Event("complete"));
  }
};

/*
 * Load the scryfall data
 */
const loadScryfallData = async (
  deck: DeckCard[]
): Promise<{ error: Error | null; cards: ScryfallCard[]; notFound: ScryfallIdentifier[] }> => {
  let cards: ScryfallCard[] = [];
  let notFound: ScryfallIdentifier[] = [];
  let error: null | Error = null;

  const identifiers: ScryfallIdentifier[] = deck.map((card) => {
    return {
      set: card.set,
      collector_number: "" + card.collectorNumber
    };
  });

  // Scryfall has a 75 card limit for identifiers
  const chunkSize = 75;
  for (let i = 0; i < identifiers.length; i += chunkSize) {
    const chunk = identifiers.slice(i, i + chunkSize);
    try {
      const response = await fetch("https://api.scryfall.com/cards/collection", {
        method: "POST",
        body: JSON.stringify({ identifiers: chunk }),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        error = new Error(response.statusText);
        continue;
      }

      // The request was successful
      if (response.body !== null) {
        const bodyString = await convertStreamToString(response.body);
        const listObj = JSON.parse(bodyString);
        cards = [...cards, ...listObj.data];
        if (listObj.not_found) {
          notFound = [...notFound, ...listObj.not_found];
        }
      }
    } catch (e: any) {
      error = e;
    }
  }

  try {
    // Fetch all english versions of the non-english cards
    const englishCards = await Promise.all(
      cards.map(async (card) => {
        if (card.lang === "en") {
          return card;
        }
        const response = await fetch(
          `https://api.scryfall.com/cards/${card.set}/${card.collector_number}/en`
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        return data as ScryfallCard;
      })
    );
    cards = englishCards;
  } catch (e: any) {
    error = e;
  }

  return { cards, notFound, error };
};

/*
 * Convert the deck string to an object
 */
const deckToJson = (deck: string): { cards: DeckCard[]; errors: number[] } => {
  const errors: number[] = [];
  const cards: DeckCard[] = [];
  const lines = deck.split("\n");

  for (let i = 0; i < deck.split("\n").length; i++) {
    const line = lines[i];

    // do nothing on blank lines
    if (line.trim() === "") {
      continue;
    }

    // Try to match the card
    const matches = line
      .trim()
      .match(/^(\d+) (.+?) \(([A-Za-z0-9]+)\) ([-A-Za-z0-9]+)( \*[FE]\*)?( (#!?.+? ?)*)?$/);
    if (matches === null) {
      errors.push(i);
      continue;
    }

    const deckSpecificTags =
      (matches[6] ?? "")
        .match(/#[^#!][^#]*/g)
        ?.map((tag) => (tag.match(/#(.*)/) as [string, string])[1].trim()) || [];
    const globalTags =
      (matches[6] ?? "")
        .match(/#![^#]*/g)
        ?.map((tag) => (tag.match(/#!(.*)/) as [string, string])[1].trim()) || [];
    cards.push({
      amount: parseInt(matches[1]),
      name: matches[2].trim(),
      set: matches[3].trim(),
      collectorNumber: matches[4].trim(),
      isFoil: matches[5]?.trim() === "*F*",
      isEtched: matches[5]?.trim() === "*E*",
      globalTags: globalTags,
      deckSpecificTags: deckSpecificTags
    });
  }
  return { cards, errors };
};

/*
 * Sort the deck by card type
 */
const sortDeck = (deck: DeckCard[], scryfallCards: ScryfallCard[]): DeckCard[] => {
  const mainTypes = [
    "Planeswalker",
    "Creature",
    "Sorcery",
    "Instant",
    "Artifact",
    "Enchantment",
    "Battle",
    "Land"
  ];

  const getMainType = (card: ScryfallCard): string => {
    const typeLine = card.type_line.split("—")[0];
    for (const type of mainTypes) {
      if (typeLine.includes(type)) {
        return type;
      }
    }
    return typeLine.split(" ")[0];
  };

  return deck.sort((a, b) => {
    const scryfallA = scryfallCards.find(
      (card) => card.collector_number === a.collectorNumber && card.set === a.set.toLowerCase()
    )!;
    const scryfallB = scryfallCards.find(
      (card) => card.collector_number === b.collectorNumber && card.set === b.set.toLowerCase()
    )!;

    return getMainType(scryfallA) > getMainType(scryfallB) ? 1 : -1;
  });
};
</script>

<style scoped>
.p-inputtextarea {
  width: 100%;
  resize: none;
}
.error-messages {
  margin-top: var(--inline-spacing);
  color: var(--red-400);
}
.error-messages > p {
  margin: 0;
}
.p-button {
  margin-top: var(--content-padding);
}
label {
  margin-bottom: var(--inline-spacing);
  display: block;
}
</style>
