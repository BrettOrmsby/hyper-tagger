<template>
  <img
      v-show="isLoaded"
      @load="() => isLoaded = true"
      :src="card?.image_uris?.normal || card?.card_faces?.[0]?.image_uris?.normal"
      :alt="card.name"
      class="card-image"
    />
    <div v-show="!isLoaded" class="card-image">
      <div class="spinner"></div>
    </div>
</template>

<script lang="ts" setup>
import { type ScryfallCard } from "@/lib/types";
import {ref, watch} from "vue"

const props = defineProps<{ card: ScryfallCard }>();
const isLoaded = ref(false)

watch(() => props.card, () => isLoaded.value = false)
</script>

<style scoped>
.card-image {
  display: block;
  width: 200px;
  border-radius: 5%;
  aspect-ratio: 745 / 1040;
  margin-bottom: var(--content-padding);
  background-color: var(--surface-c);
  text-align: center;
}
.card-image::before {
  padding: var(--content-padding);
  display: block;
}

.card-image:has(.spinner) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 0.5rem solid var(--primary-color);
  animation:
    spinner-bulqg1 0.8s infinite linear alternate,
    spinner-oaa3wk 1.6s infinite linear;
}

@keyframes spinner-bulqg1 {
  0% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
  }

  12.5% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
  }

  25% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
  }

  50% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
  }

  62.5% {
    clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
  }

  75% {
    clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
  }

  100% {
    clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
  }
}

@keyframes spinner-oaa3wk {
  0% {
    transform: scaleY(1) rotate(0deg);
  }

  49.99% {
    transform: scaleY(1) rotate(135deg);
  }

  50% {
    transform: scaleY(-1) rotate(0deg);
  }

  100% {
    transform: scaleY(-1) rotate(-135deg);
  }
}
</style>
