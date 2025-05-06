<script lang="ts" setup>
import Tile from "../Tile.vue";
import Upload from "./Upload.vue";
</script>

<template>
  <div :class="$style.slider">
    <div :class="$style.content">
      <Tile v-for="(n, i) in 10" :id="n" :key="i" />
      <Upload />
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
  border-bottom: 1px solid #999;
}

.content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1em;
  flex-wrap: nowrap;

  &:after {
    content: "";
    flex-shrink: 0;
    height: 1em;
    width: 1px;
  }

}
</style>
