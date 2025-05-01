<template>
  <div :class="$style.editor">
    <div :class="$style.bg"></div>
    <div :class="$style.container">
      <div :class="$style.placeholder" />
      <Panel />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "../../styles/editor/index.css"
import Panel from './Panel/Index.vue';

</script>

<style module>
.editor {
  position: relative;
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.container {
  display: flex;
  gap: 1em;
  padding: 1em;
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
  position: relative;
  transition: grid-template-columns 0.3s ease;
  pointer-events: none;
}

.placeholder {
  flex: 1;
  height: 1px;
  pointer-events: none;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/test/isometric-cubes.jpeg");
  background-size: cover;
  background-position: center;
  filter: blur(10px) brightness(0.6);
}

canvas {
  position: fixed;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
