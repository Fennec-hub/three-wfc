<script lang="ts" setup>
import Tile from "../Tile.vue";
import CreateTile from "../../Panel/Tiles/Create.vue"
import { useEditor } from "../../../../composables/editor/useEditor";
import { computed } from "vue";
import { Tile2DState, TileVirtualTransform } from "../../../../composables/types";

const { tiles, state } = useEditor();
const tileList = computed(() => {
  const list: (Tile2DState & { transform: TileVirtualTransform | null })[] = [];
  const selected = state.selectedTile;

  Object.values(tiles).forEach((tile: Tile2DState) => {
    list.push({ ...tile, transform: null })

    if (tile.id !== selected) return;

    tile.reflect.forEach((reflect, i) => {
      if (reflect) list.push({ ...tile, transform: [i as any, "x"] })
    });

    tile.rotation.forEach((rotate, i) => {
      if (rotate) list.push({ ...tile, transform: [(i + 2) as any, "x"] })
    });
  })

  return list
})
</script>

<template>
  <div :class="$style.slider">
    <div :class="$style.content">
      <Tile v-for="{ id, transform } in tileList" :id="id" :key="`${id}-${transform?.[0]}`" :transform="transform" />
      <CreateTile />
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
  min-height: 15%;
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

.transform {
  transform: scale(0.8);
}
</style>
