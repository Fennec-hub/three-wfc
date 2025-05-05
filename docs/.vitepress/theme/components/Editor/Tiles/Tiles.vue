<script lang="ts" setup>
import RulesGrid from './Rules/OuterGrid.vue';
import List from './List/Slider.vue';
</script>

<template>
  <div :class="$style.tiles">
    <List />
    <RulesGrid />
  </div>
</template>

<style module>
.tiles {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 0 calc(325px + 2em) 0 0;
  background-color: var(--panel-bg-frost);
  backdrop-filter: blur(var(--backdrop-blur-amount));
  -webkit-backdrop-filter: blur(var(--backdrop-blur-amount));
  border-radius: var(--editor-border-radius);
  width: 95%;
  max-width: 1400px;
  height: 90vh;
  max-height: 800px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform-origin: right center;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: calc(325px + 2em);
    height: 100%;
    width: 1px;
    background-color: #999;
  }
}
</style>
