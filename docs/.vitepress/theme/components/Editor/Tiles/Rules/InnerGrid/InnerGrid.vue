<script lang="ts" setup>
import { computed } from 'vue';
import { EDITOR_2D_EDGES } from '../../../../../composables/constants';
import { useEditor } from '../../../../../composables/editor/useEditor';
import EdgeColors from './EdgeColors.vue';

const { tiles, state } = useEditor();

const tile = computed(() => tiles[state.selectedTile!]);
</script>

<template>
  <div :class="$style['inner-grid']">
    <div :class="$style.tile">
      <img :src="tile.image" :alt="tile.name" />
      <EdgeColors v-for="(edge, i) in EDITOR_2D_EDGES" :class="[$style[edge]]" :id="tile.id" :edge="edge" :col="i > 1"
        :key="i" />
    </div>
  </div>
</template>

<style module>
.inner-grid {
  z-index: 1;
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &:before,
  &:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    width: calc(100% - 2.5em);
    height: calc(100% - 2.5em);
    transform: translate(-50%, -50%);
    background-color: #999;
  }

  &:before {
    height: 1px;
  }

  &:after {
    width: 1px;
  }
}

.tile {
  position: relative;
  justify-self: center;
  max-width: 45%;

  img {
    width: 500px;
  }
}

.top {
  top: 0;
  left: 50%;
  transform: translate(-50%, calc(-100% - 1em));
}

.right {
  top: 50%;
  right: 0;
  transform: translate(calc(100% + 1em), -50%);
}

.bottom {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, calc(100% + 1em));
}

.left {
  top: 50%;
  left: 0;
  transform: translate(calc(-100% - 1em), -50%);
}
</style>
