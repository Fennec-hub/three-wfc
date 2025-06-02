<script lang="ts" setup>
import { computed } from 'vue';
import { EDITOR_SECTIONS } from '../../../composables/constants';
import { useEditor } from '../../../composables/editor/useEditor';
import { EditorMode } from '../../../composables/types';

const { state, worldsCount, tilesCount, setMode } = useEditor();

const tabs = computed(() => {
  const noWorlds = !worldsCount.value || !state.selectedWorld;
  const noTiles = !tilesCount.value;
  return Object.values(EDITOR_SECTIONS).splice(0, noWorlds ? 1 : noTiles ? 2 : 3);
});
</script>

<template>
  <ul v-if="tabs.length > 1" :class="$style.tabs">
    <li v-for="({ name, icon }, index) in tabs" :class="[$style.tab, { [$style.active]: state.mode === index }]"
      @click="setMode(index as EditorMode)">
      <v-icon :name="icon" />
      {{ name }}
    </li>
  </ul>
</template>

<style module>
.tabs {
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 1em;
  border-bottom: 1px solid #fff2;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% / v-bind('tabs.length'));
    height: 3px;
    background-color: var(--accent-color);
    border-radius: 3px;
    transform: translateY(50%) translateX(calc(100% * v-bind('state.mode')));
    transition: transform 0.3s ease;
  }
}

.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex: 1;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s ease;
  color: var(--text-muted);

  svg {
    margin: 0 0.5em 0 0;
  }

  &:before {
    content: "";
    position: absolute;
    top: 25%;
    right: 0;
    height: 50%;
    width: 1px;
    background-color: #fff2;
  }

  &:last-child {
    &:before {
      display: none;
    }
  }

  &.active {
    font-weight: 500;
    color: var(--accent-color);

    svg {
      color: var(--text-color);
    }
  }

  &:hover:not(.active) {
    color: var(--text-color);
  }
}
</style>
