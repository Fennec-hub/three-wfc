<script lang="ts" setup>
import Grid from "./Gird.vue";
import Tiles from "./Tiles/Index.vue";
import Worlds from "./World/List.vue";
import Tabs from "./Tabs.vue";
import Actions from "./Actions.vue";
import { useEditor } from "../../../composables/editor/useEditor";
import { EDITOR_MODE_GRID } from "../../../composables/constants";

const { state, tilesCount, expand } = useEditor();
const components = [Worlds, Tiles, Grid];
</script>

<template>
  <main :class="$style.wrapper">
    <Tabs />

    <KeepAlive>
      <Component :is="components[state.mode]" :class="$style.content" />
    </KeepAlive>

    <Actions v-if="tilesCount && state.mode === EDITOR_MODE_GRID" />

    <i v-if="tilesCount" :class="$style['collapse-button']" @click="expand(false)">
      <v-icon name="md-arrowforwardios-round" :scale="1" />
    </i>
  </main>
</template>

<style module>
.wrapper {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1em;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;

  section {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0.5em 0.75em 1em;
    background-color: var(--vp-c-bg-mute);
    border-radius: 0.4em;

    &.blank {
      background-color: none;
    }
  }

  h2 {
    color: var(--accent-color);
    margin: 0 0 -0.5em calc(30% + 0.5em);
    font-weight: 500;
    font-size: 0.9em;
  }
}

.collapse-button {
  position: absolute;
  top: 4em;
  right: -0.4em;
  color: var(--vp-c-bg-soft);
  padding: 0.1em 0em;
  background-color: var(--accent-color);
  border-radius: 0.2em;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}
</style>
