<script lang="ts" setup>
import { EDITOR_2D_EDGES } from "../../../../composables/constants";
import Tile from "../Tile.vue"

defineProps<{ dir: typeof EDITOR_2D_EDGES[number], col: boolean }>();
</script>

<template>
  <div :class="[$style['edge-tiles'], $style[dir], { [$style.col]: col }]"
    :style="{ ['--compatible-edge']: `'Compatible ${dir} edges'` }">
    <Tile v-for="(n, i) in 3" :id="n" :key="i" />
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
      top: calc(-100% + 1.3em);
    }

    &:after {
      top: calc(-100% + 1.5em);
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
