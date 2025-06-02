<script lang="ts" setup>
import { useEditor } from '../../../composables/editor/useEditor';
import { EDITOR_MODE_TILES, PANEL_POSITION_CENTER, PANEL_POSITION_RIGHT } from "../../../composables/constants";
import { onMounted, ref, watch, useTemplateRef, nextTick } from "vue";
import { useThrottleFn } from '@vueuse/core'
import Wrapper from "./Wrapper.vue";
import Collapsed from "./Collapsed.vue";
import Loader from "./Loader.vue"
import Error from './Error.vue';

const { state, worldsCount, initialize } = useEditor();

initialize();

const target = useTemplateRef('target');
const root = useTemplateRef('root');
const translateX = ref<string>("0px");

const positionPanel = useThrottleFn(async () => {
  if (state.position === PANEL_POSITION_RIGHT)
    return translateX.value = "0px";

  const isCentred = state.position === PANEL_POSITION_CENTER;

  const rootEl = root.value!;
  const targetRect = (isCentred ? document.body : target.value!).getBoundingClientRect();
  const rootRight = rootEl.offsetLeft + rootEl.offsetWidth;

  const rightDifference = isCentred
    ? (targetRect.right - targetRect.width / 2) - rootRight + rootEl.offsetWidth / 2
    : targetRect.right - rootRight;

  translateX.value = `${rightDifference.toFixed(4)}px - 1em`;
}, 250, true);

onMounted(positionPanel);
watch(() => state.position, positionPanel);
window.onresize = positionPanel;
</script>

<template>
  <div ref="target" :class="$style.target" />
  <div ref="root"
    :class="[$style.panel, { [$style.center]: $style.center, [$style.collapse]: !state.expanded, [$style['tiles-mode']]: state.mode === EDITOR_MODE_TILES }]"
    :style="{ ['--translate-x']: translateX }">

    <Error v-if="state.error" />

    <Loader v-else-if="state.loading && !worldsCount" :scale="3" />

    <KeepAlive v-else>
      <Wrapper v-if="state.expanded" />
      <Collapsed v-else />
    </KeepAlive>

  </div>
</template>

<style module>
.target {
  position: absolute;
  width: 95%;
  height: 1px;
  max-width: 1400px;
  pointer-events: none;
  z-index: -1;
}

.panel {
  position: absolute;
  z-index: 10;
  top: 50%;
  right: 2em;
  transform: translate(calc(var(--translate-x)), -50%);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: 90%;
  width: 325px;
  padding: 0.5em 0;
  margin: auto 0;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--editor-border-radius);
  transition: transform 0.3s ease-out;
  will-change: transform;
  pointer-events: all;

  &.collapse {
    width: 60px;
    min-height: 300px;
    padding: 1em 0.5em;
    transition: transform 0.3s ease-out, width 0.3s ease-out;
  }
}
</style>