<script lang="ts" setup>
defineProps<{ id: number }>();
</script>

<template>
  <div :class="$style.tile">
    <img :src="`https://picsum.photos/id/${id * 5}/100/100`" />
  </div>
</template>

<style module>
.tile {
  overflow: hidden;
  flex: 0 0 auto;
  margin: 2px;
  border: 1px solid var(--panel-bg);
  border-radius: var(--editor-border-radius);
  transition: border-color 0.15s ease;
  cursor: pointer;

  img {
    width: auto;
    height: auto;
  }

  &.selected {
    margin: 0;
    border: 3px solid var(--accent-color);
  }

  &:hover {
    margin: 1px;
    border: 2px solid var(--accent-color);
  }
}
</style>
