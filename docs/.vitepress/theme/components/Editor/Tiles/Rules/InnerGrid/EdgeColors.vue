<script lang="ts" setup>
import { computed } from 'vue';
import { useEditor } from '../../../../../composables/editor/useEditor';
import { TileEdge } from '../../../../../composables/types';
import ColorPicker from './ColorPicker.vue';

const { tiles, updateTileEdge } = useEditor();

const { id, edge, col } = defineProps<{ id: number, edge: TileEdge, col: boolean }>();
const colors = computed(() => tiles[id][edge])
</script>

<template>
  <div :class="[$style['edge-colors'], { [$style.col]: col }]">
    <ColorPicker v-for="(color, index) in colors" :key="`${index}-${color}`" :color="color"
      @remove="updateTileEdge(id, edge, index)" @update="updateTileEdge(id, edge, index, $event)" />
    <ColorPicker add :id="id" :index="-1" :edge="edge" :key="-1" @add="updateTileEdge(id, edge, -1)" />
  </div>
</template>

<style module>
.edge-colors {
  position: absolute;
  display: flex;
  justify-content: center;
  gap: 1em;
  width: 100%;
  height: auto;

  &.col {
    flex-direction: column;
    justify-content: center;
    width: auto;
    height: 100%;
  }
}
</style>
