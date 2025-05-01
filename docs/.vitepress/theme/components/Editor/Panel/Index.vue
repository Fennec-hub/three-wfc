<template>
  <div :class="[$style.panel, { [$style.collapse]: collapse }]">
    <template v-if="!collapse">
      <ul :class="$style.tabs">
        <li v-for="(name, index) in sections" :class="[$style.tab, { [$style.active]: section === index }]"
          @click="section = index">{{ name }}</li>
      </ul>

      <div :class="$style.content"></div>

      <i :class="$style['reduce-button']" @click="collapse = !collapse">></i>
    </template>
    <template v-else>
      <i class="icon" @click="collapse = false">
        <v-icon name="fa-external-link-alt" />
      </i>
      <i class="icon">
        <v-icon name="fa-expand" />
      </i>
      <i class="icon">
        <v-icon name="fa-expand" />
      </i>
      <i class="icon">
        <v-icon name="fa-expand" />
      </i>
      <i class="icon">
        <v-icon name="fa-expand" />
      </i>
      <i class="icon">
        <v-icon name="fa-expand" />
      </i>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const sections = ["Projects", "Grid", "Tiles"];

const section = ref<number>(0);
const collapse = ref<boolean>(false);

</script>

<style module>
.panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 300px;
  padding: 0.5em 1em;
  margin: auto 0;
  gap: 0;
  width: 280px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--editor-border-radius);
  transition: width 0.3s ease, padding 0.3s ease;
  pointer-events: all;
  transition: width 0.3s ease, padding 0.3s ease;

  &.collapse {
    width: 40px;
    padding-left: 5px;
    padding-right: 5px;
  }
}

.content {}

.tabs {
  position: relative;
  display: flex;
  justify-content: center;
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
    transform: translateY(50%) translateX(calc(100% * v-bind('section')));
    transition: transform 0.3s ease;
  }
}

.tab {
  position: relative;
  flex: 1;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s ease;
  color: var(--text-muted);

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
  }

  &:hover:not(.active) {
    color: var(--text);
  }
}

.reduce-button {
  position: absolute;
  top: 5em;
  right: 0;
  color: var(--vp-c-bg-soft);
  font-size: 1.1em;
  padding: 5px;
  background-color: var(--accent-color);
  border-radius: 0.2em;
  transform: translateX(-50%);
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.icon {}
</style>