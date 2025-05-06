<script lang="ts" setup>
import InnerGrid from './InnerGrid/InnerGrid.vue';
import Edge from './EdgeTiles.vue';
import { EDITOR_2D_EDGES } from '../../../../composables/constants';
</script>

<template>
  <div :class="$style['outer-grid']">
    <InnerGrid />
    <Edge v-for="(edge, i) in EDITOR_2D_EDGES" :class="[$style[edge]]" :dir="edge" :col="!!(i % 2)" :key="i" />
  </div>
</template>

<style module>
.outer-grid {
  position: relative;
  flex-grow: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  justify-items: center;
  min-width: 0;
  min-height: 0;
  margin: auto;
  padding: 0.5em;
}

.top {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.right {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.bottom {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.left {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
</style>
