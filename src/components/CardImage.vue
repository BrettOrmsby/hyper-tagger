<template>
  <img
    :src="card?.image_uris?.normal || card?.card_faces?.[0]?.image_uris?.normal"
    :alt="card.name"
    class="card-image"
  />
</template>

<script lang="ts" setup>
import { type ScryfallCard } from "@/lib/types";

defineProps<{ card: ScryfallCard }>();
</script>

<style scoped>
.card-image {
  border-radius: 5%;
}
</style>
