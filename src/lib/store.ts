import { reactive } from "vue";
import { useStorage } from "@vueuse/core";
import type { DeckCard, ScryfallCard } from "./types";

type Store = {
  deck: DeckCard[];
  scryfallCards: ScryfallCard[];
  isDeckEdited: boolean;
  cardIndex: number;
  isTagsEdited: boolean;
};
const store = reactive<Store>({
  deck: [],
  scryfallCards: [],
  isDeckEdited: false,
  cardIndex: 0,
  isTagsEdited: false
});

type Settings = {
  hideTags: "none" | "deckSpecific" | "global";
  hideTaggedCards: "none" | "deckSpecific" | "global" | "any";
  allowMultiselect: boolean;
};

const settings = useStorage(
  "settings",
  { hideTags: "none", hideTaggedCards: "any", allowMultiselect: false } as Settings,
  localStorage,
  { mergeDefaults: true }
);

export default store;
export { settings };
