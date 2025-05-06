<script lang="ts" setup>
import { EDITOR_3D_EDGES } from '../../../../../composables/constants';
import ColorPicker from './ColorPicker.vue';

defineProps<{ dir: typeof EDITOR_3D_EDGES[number], col: boolean }>();
</script>

<template>
  <div :class="[$style['edge-colors'], { [$style.col]: col }]">
    <ColorPicker v-for="(n) in 3" :key="n" :dir="dir" :col="col" />
    <ColorPicker add :dir="dir" :col="col" :key="-1" />
  </div>
</template>

<style module>
.edge-colors {
  position: absolute;
  display: flex;
  justify-content: space-around;
  gap: 1em;
  width: 100%;
  height: auto;

  &.col {
    flex-direction: column;
    width: auto;
    height: 100%;
  }

}
</style>
