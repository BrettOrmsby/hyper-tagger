<template>
  <h2>Help</h2>
  <Accordion>
    <AccordionTab>
      <template #header>
        <PenIcon class="icon" />
        <span>Load A Deck</span>
      </template>
      <p>
        Go to your deck on Moxfield and click the Edit/Bulk Edit link. Copy the deck to your
        clipboard and paste it into the textarea above. Press the load deck button to start loading
        the cards. Unless there was an issue with copying the deck from Moxfield, no errors should
        occur.
      </p>
    </AccordionTab>
    <AccordionTab>
      <template #header>
        <SettingsIcon class="icon" />
        <span>Settings</span>
      </template>
      <p>
        Enter the settings by clicking the menu button (<MenuIcon />) and selecting the settings
        option (<SettingsIcon />).
      </p>
      <p>The default settings are to hide all tagged cards and show all tags.</p>
      <p>
        Generally, if you want to tag the deck quickly and not provide multiple tags, you should
        hide all tagged cards or, depending on how you tag the deck, hide the globally tagged cards
        or deck-specifically tagged cards. If you want to tag the cards with multiple tags, you
        should likely show all cards.
      </p>
      <p>
        If you are not using certain tags to tag, you can hide them using the hide global tags or
        hide deck-specific tags options.
      </p>
    </AccordionTab>
    <AccordionTab>
      <template #header>
        <PlusIcon class="icon" />
        <span>Add A Tag</span>
      </template>
      <p>
        Click the menu button (<MenuIcon />) and select the add option (<PlusIcon />). To add a tag,
        type the tag name into the global or deck-specific section and press <kbd>Enter</kbd> or
        <kbd>Return</kbd>. To remove a tag, press the X (<XCircleIcon />) beside the tag.
      </p>
    </AccordionTab>
    <AccordionTab>
      <template #header>
        <CopyClipboard class="icon" />
        <span>Export Deck</span>
      </template>
      <p>
        Click the menu button (<MenuIcon />) and select the copy to clipboard option (<CopyClipboard />).
        Then, paste the deck into the Edit/Bulk Edit textarea.
      </p>
    </AccordionTab>
  </Accordion>
</template>

<script lang="ts" setup>
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import PenIcon from "./icons/PenIcon.vue";
import SettingsIcon from "./icons/SettingsIcon.vue";
import PlusIcon from "./icons/PlusIcon.vue";
import CopyClipboard from "./icons/CopyClipboard.vue";
import MenuIcon from "./icons/MenuIcon.vue";
import XCircleIcon from "./icons/XCircleIcon.vue";
</script>

<style scoped>
.icon {
  margin-right: var(--inline-spacing);
}
svg {
  vertical-align: middle;
}
p:first-child {
  margin-top: 0;
}
p:last-child {
  margin-bottom: 0;
}
</style>
