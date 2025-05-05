<script lang="ts" setup>
import Tile from "../Tile.vue"

defineProps<{ dir: 'top' | 'right' | 'bottom' | 'left', col: boolean }>();


</script>

<template>
  <div :class="[$style.edge, { [$style.col]: col }]">
    <Tile v-for="(n, i) in 3" :id="n" :key="i" />
  </div>
</template>

<style module>
.edge {
  position: relative;
  display: flex;
  gap: 1em;
  margin: 1em;

  &.col {
    flex-direction: column;
  }

  img {
    max-height: 50px;
    height: auto;
    width: auto;
  }
}
</style>
