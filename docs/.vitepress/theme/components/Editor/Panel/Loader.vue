<script lang="ts" setup>
const { scale = 2 } = defineProps<{ scale?: number }>();
</script>

<template>
  <i :class="$style.loader">
    <v-icon name="fa-spinner" :scale="scale" animation="spin-pulse" />
  </i>
</template>

<style module>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1.5em;
}
</style>
