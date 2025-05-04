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
  max-height: 100%;
  border-radius: var(--editor-border-radius);

  img {
    max-height: 100%;
    height: auto;
    width: auto;
  }
}
</style>
