<script lang="ts" setup>
const onChange = (event: Event) => {
  const urls: string[] = [];
  const files = (<HTMLInputElement>event.target).files || [];

  for (const file of files)
    urls.push(URL.createObjectURL(file));
}
</script>

<template>
  <div :class="$style.upload">
    <input type="file" accept="image/*" multiple @change="onChange" />
    <v-icon name="fa-plus" :scale="2.5" />
  </div>
</template>

<style module>
.upload {
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: calc(100% - 6px);
  height: calc(100% - 6px);
  aspect-ratio: 1;
  margin: 0 1em 0 0;
  color: var(--accent-color);
  border: 2px dashed var(--accent-color);
  border-radius: var(--editor-border-radius);
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: var(--accent-color);
    color: var(--panel-bg);
  }

  input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
