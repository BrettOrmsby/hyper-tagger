import { reactive } from "vue";
import { useStorage } from "@vueuse/core";
import type { DeckCard, ScryfallCard } from "./types";

type Store = {
  deck: DeckCard[];
  scryfallCards: ScryfallCard[];
  isDeckEdited: boolean;
  cardIndex: number;
  isTagsEdited: boolean;
  isSettingsOpened: boolean;
  isAddTagOpen: boolean;
  globalTags: string[];
  deckSpecificTags: string[];
};
const store = reactive<Store>({
  deck: [],
  scryfallCards: [],
  isDeckEdited: false,
  globalTags: [],
  deckSpecificTags: [],
  cardIndex: 0,
  isTagsEdited: false,
  isSettingsOpened: false,
  isAddTagOpen: false
});

type Settings = {
  hideTags: "none" | "deckSpecific" | "global";
  hideTaggedCards: "none" | "deckSpecific" | "global" | "any";
};

const settings = useStorage(
  "settings",
  { hideTags: "none", hideTaggedCards: "any" } as Settings,
  localStorage,
  { mergeDefaults: true }
);

export default store;
export { settings };
