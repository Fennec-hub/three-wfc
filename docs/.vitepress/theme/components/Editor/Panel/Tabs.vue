<script lang="ts" setup>
import { EDITOR_SECTIONS } from '../../../composables/constants';
import { useEditor } from '../../../composables/editor/useEditor';

const { state, setMode } = useEditor();
</script>

<template>
  <ul :class="$style.tabs">
    <li v-for="({ name, icon }, index) in EDITOR_SECTIONS"
      :class="[$style.tab, { [$style.active]: state.mode === index }]" @click="setMode(index)">
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
    width: 33%;
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
