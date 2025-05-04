<script lang="ts" setup>
import Tile from "./Tile.vue";
</script>

<template>
  <div :class="$style['tiles-list']">
    <div :class="$style.slider">
      <Tile v-for="(n, i) in 10" :id="n" :key="i" />
    </div>
  </div>
</template>

<style module>
.tiles-list {
  position: relative;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  min-height: 15%;
  width: 100%;
  padding: 1em;
  flex-shrink: 0;
}

.slider {
  display: inline-flex;
  gap: 1em;
  flex-wrap: nowrap;
}
</style>
