<script lang="ts" setup>
import ColorPicker from './ColorPicker.vue';

defineProps<{ dir: 'top' | 'right' | 'bottom' | 'left', col: boolean }>();
</script>

<template>
  <div :class="[$style['edge-colors'], { [$style.col]: col }]">
    <ColorPicker v-for="(n) in 3" :key="n" :dir="dir" :col="col" />
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
