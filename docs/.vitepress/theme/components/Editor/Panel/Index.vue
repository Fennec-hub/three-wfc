<script lang="ts" setup>
import { ref } from 'vue';
import Grid from "./Gird.vue";
import Tiles from "./Tiles.vue";
import World from "./World.vue";

const enum Sections {
  World,
  Tiles,
  Grid,
}

const sections: [name: string, icon: string][] = [["World", "gi-earth-africa-europe"], ["Tiles", "hi-solid-puzzle"], ["Grid", "md-gridon-outlined"]];
const section = ref<Sections>(0);
const collapse = ref<boolean>(false);

const expand = (index: number) => {
  section.value = index;
  collapse.value = false;
}
</script>

<template>
  <div :class="[$style.panel, { [$style.collapse]: collapse }]">
    <div v-if="!collapse" :class="$style.content">
      <ul :class="$style.tabs">
        <li v-for="([name, icon], index) in sections" :class="[$style.tab, { [$style.active]: section === index }]"
          @click="section = index">
          <v-icon :name="icon" />
          {{ name }}
        </li>
      </ul>

      <div :class="$style.content">
        <World v-if="section === Sections.World" />
        <Tiles v-else-if="section === Sections.Tiles" />
        <Grid v-else />
      </div>

      <i :class="$style['collapse-button']" @click="collapse = !collapse">
        <v-icon name="md-arrowforwardios-round" :scale="1" />
      </i>
    </div>
    <div v-else :class="$style.min">
      <ul :class="$style['min-tabs']">
        <li v-for="([content, icon], index) in sections" :class="$style['min-tab']" @click="expand(index)"
          v-tooltip.right-start="{ content, placement: 'left', distance: 15 }">
          <v-icon :name="icon" :scale="1.3" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style module>
.panel {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /* !TMP */
  min-height: 600px;
  padding: 0.5em 1em;
  margin: auto 0;
  gap: 0;
  width: 325px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--editor-border-radius);
  transition: width 0.3s ease, padding 0.3s ease;
  pointer-events: all;
  transition: width 0.3s ease, min-height 0.3s ease;

  &.collapse {
    width: 60px;
    min-height: 300px;
    padding: 1em 0.5em;
  }
}

.content {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;

  section {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0.5em 1em 1em;
    background-color: var(--vp-c-bg-mute);
    /* border: 1px solid rgba(255, 255, 255, 0.08); */
    border-radius: 0.4em;
  }

  h2 {
    color: var(--accent-color);
    margin: 0 0 -0.5em calc(30% + 0.5em);
    font-weight: 500;
    font-size: 0.9em;
    /* border-bottom: 1px solid #fff1; */
    /* padding: 0 0 0.5em; */
  }
}

.tabs {
  overflow: hidden;
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



.min {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}

.min-tabs {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 0 0.5em;
  border-bottom: 1px solid #fff2;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 120%;
    height: 1px;
    background-color: #fff2;
    border-radius: 3px;
    transform: translateX(-50%);
  }
}

.min-tab {
  padding: .5em 0;
  color: var(--text-color);
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: var(--accent-color);
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
  /*transform: translateX(-50%);*/
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}
</style>