<script lang="ts" setup>
import { useEditor } from '../../../composables/editor/useEditor';
import { computed, ref } from 'vue';
import { TileVirtualTransform } from '../../../composables/types';
import { TILE_TRANSFORMATION } from '../../../composables/constants';

const { id, removable = true, transform } = defineProps<{ id: number, removable?: boolean; transform?: TileVirtualTransform | null }>();

const { tiles, selectTile, removeTile, state } = useEditor();
const tile = computed(() => tiles[id]);
const selected = computed(() => state.selectedTile === id && (!transform || transform?.[0] === state.selectedTransform?.[0]));
const transformed = transform ? TILE_TRANSFORMATION[transform[0]] : null;

const remove = ref<boolean>(false);
</script>

<template>
  <div v-if="tile"
    :class="[$style.tile, { [$style.selected]: selected, [$style.disabled]: !tile.enabled, [$style.remove]: remove, [$style.transformed]: transformed }]"
    @click="selectTile(id, transform)">
    <b>
      <img :src="tile.thumb" :alt="tile.name"
        v-tooltip="{ content: `#<b>${id}</b> - ${tile.name} ${transformed ? `<br/>${transformed.tooltip}` : ''}`, distance: 15, html: true, delay: { show: 500, hide: 100 } }"
        :style="{ transform: transformed ? transformed.style : '' }" />
    </b>
    <i v-if="transformed">
      <v-icon :name="transformed.icon" :style="{ transform: transformed ? transformed.iconStyle : '' }" :scale="1" />
    </i>
    <i v-else-if="removable" @click.stop="removeTile(id)" @pointerenter="remove = true" @pointerleave="remove = false">
      <v-icon name="fa-plus" :scale="0.9" />
    </i>
  </div>
</template>

<style module>
.tile {
  position: relative;
  flex: 0 0 auto;
  margin: 1px;
  border: 1px solid var(--panel-bg);
  border-radius: var(--editor-border-radius);
  transition: border-color 0.15s ease;
  cursor: pointer;

  b {
    display: block;
    overflow: hidden;
    border-radius: var(--editor-border-radius);
  }

  &:hover {
    i {
      display: flex;
    }
  }

  &:hover,
  &.selected {
    margin: 0;
    border: 2px solid var(--accent-color);
  }

  i {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    width: 1.5em;
    height: 1.5em;
    border-radius: 2em;
    color: var(--panel-bg);
    background-color: var(--accent-color);
    transition: background-color 0.15s ease;

    &:hover {
      background-color: var(--alert-color);
    }
  }

  img {
    min-width: 6em;
    max-width: 6em;
    max-height: 6em;
    aspect-ratio: 1;
  }

  i svg {
    transform: rotate(45deg);
  }
}

.remove {
  border-color: var(--alert-color) !important;
}

.disabled {
  opacity: 0.5;
  --strips-color: #060606;
  background-color: var(--accent-color);
  background: repeating-linear-gradient(-45deg, var(--strips-color), var(--strips-color) 2px, var(--accent-color) 2px, var(--accent-color) 10px);
}

.transformed {
  position: relative;
  z-index: 1;

  &:hover {
    i {
      display: flex;
    }

    img {
      transform: scale(1.4);
    }
  }

  &.selected {
    border-style: dashed !important;
  }

  img {
    min-width: 4em;
    max-width: 4em;
    max-height: 4em;
    transition: transform 150ms ease;
  }

  i {
    display: flex;
    border-radius: 0.3em;
    pointer-events: none;

    svg {
      transform: unset;
    }
  }
}
</style>
