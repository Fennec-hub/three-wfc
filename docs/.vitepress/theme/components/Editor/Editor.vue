<script lang="ts" setup>
import { EDITOR_MODE_TILES } from "../../composables/constants";
import { useEditor } from "../../composables/editor/useEditor";
import "../../styles/editor/index.css"
import Panel from './Panel/Panel.vue';
import Tiles from './Tiles/Tiles.vue';

const { state } = useEditor();

</script>

<template>
  <div :class="[$style.editor, { [$style.blur]: state.mode === EDITOR_MODE_TILES }]">
    <div :class="$style.bg" />
    <Panel />
    <Transition>
      <Tiles v-if="state.mode === EDITOR_MODE_TILES" />
    </Transition>
  </div>
</template>

<style module>
.editor {
  position: relative;
  z-index: 1;
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &.blur {
    .bg {
      filter: blur(10px) brightness(0.8);
    }
  }
}

.bg {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  background-image: url("/test/isometric-cubes.jpeg");
  background-size: cover;
  background-position: center;
  filter: blur(0) brightness(1);
  transition: filter 0.3s ease-out;
}

canvas {
  position: fixed;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}

/* Scrollbar styles */
.editor {
  @supports not selector(::-webkit-scrollbar) {

    &,
    * {
      scrollbar-width: medium;
      scrollbar-color: var(--accent-color) transparent;
    }
  }

  &::-webkit-scrollbar,
  *::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  &::-webkit-scrollbar-track,
  *::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: transparent;
    border: 5px solid transparent;
  }

  &::-webkit-scrollbar-track:hover,
  *::-webkit-scrollbar-track:hover {
    background-color: transparent;
  }

  &::-webkit-scrollbar-track:active,
  *::-webkit-scrollbar-track:active {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb,
  *::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--accent-color);
  }

  &::-webkit-scrollbar-thumb:hover,
  *::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-color);
  }

  &::-webkit-scrollbar-thumb:active,
  *::-webkit-scrollbar-thumb:active {
    background-color: var(--text-color);
  }
}
</style>

<style>
.v-enter-active,
.v-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0) translateX(15%);
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  transform: scale(1) translateX(0);
  opacity: 1;
}
</style>