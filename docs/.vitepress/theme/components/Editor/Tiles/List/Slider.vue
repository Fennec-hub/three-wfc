<script lang="ts" setup>
import Tile from "../Tile.vue";
</script>

<template>
  <div :class="$style.slider">
    <div :class="$style.content">
      <Tile v-for="(n, i) in 6" :id="n" :key="i" />
    </div>
  </div>
</template>

<style module>
.slider {
  display: flex;
  position: relative;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  width: 100%;
  padding: 1em;
  flex-shrink: 0;
}

.content {
  display: inline-flex;
  gap: 1em;
  flex-wrap: nowrap;
  margin: auto;
}
</style>
