<script lang="ts" setup>
import { useEditor } from "../../../../composables/editor/useEditor";
import { TileEdge } from "../../../../composables/types";
import Tile from "../Tile.vue"

defineProps<{ edge: TileEdge, col: boolean }>();

const { state } = useEditor();
</script>

<template>
  <div :class="[$style['edge-tiles'], $style[edge], { [$style.col]: col }]"
    :style="{ ['--compatible-edge']: `'Compatible ${edge} edges'` }">
    <Tile v-for="tileID in state.compatible[edge]" :id="tileID" :key="tileID" :removable="false" />
  </div>
</template>

<style module>
.edge-tiles {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin: 0.5em 1em;
  min-height: 50px;
  min-width: 250px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    background-color: #999;
  }

  &:before {
    left: 10%;
    height: 1px;
    width: 80%;
  }

  &:after {
    font-size: 0.9em;
    color: var(--text-muted);
    height: auto;
    content: var(--compatible-edge);
    text-wrap: nowrap;
    background-color: unset;
    top: 100%;
    left: 50%;
    transform: translateX(-50%)
  }


  &.col {
    flex-direction: column;
    min-height: 250px;
    min-width: 50px;

    &:before {
      top: 10%;
      left: -2.25em;
      height: 80%;
      width: 1px;
    }

    &:after {
      width: 1px;
      top: 50%;
      left: -2.5em;
      transform: translateY(-50%);
      writing-mode: sideways-lr;
    }
  }

  &.top {
    &:before {
      top: calc(100% + 1.75em);
    }

    &:after {
      top: calc(100% + 0.25em);
    }
  }

  &.bottom {
    &:before {
      top: calc(-100% + 1.75em);
    }

    &:after {
      top: calc(-100% + 2em);
    }
  }

  &.left {
    &:before {
      left: calc(100% + 2.25em);
    }

    &:after {
      left: calc(100% + 0.75em);
    }
  }


  img {
    max-height: 50px;
  }
}
</style>
