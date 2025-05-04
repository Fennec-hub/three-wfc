<script lang="ts" setup>
import Main from "./Main.vue";
import Collapsed from "./Collapsed.vue";
import { useEditor } from '../../../composables/editor/useEditor';
import { EDITOR_MODE_TILES } from "../../../composables/constants";
import { onMounted, ref, watch, useTemplateRef } from "vue";
import { useThrottleFn } from '@vueuse/core'

const { state } = useEditor();

const target = useTemplateRef('target');
const root = useTemplateRef('root');
const translateX = ref<string>("0px");

const alignToTarget = useThrottleFn(() => {
  if (state.mode !== EDITOR_MODE_TILES)
    return translateX.value = "0px";

  const targetRect = target.value!.getBoundingClientRect();
  const rootEl = root.value!;
  const rootRight = rootEl.offsetLeft + rootEl.offsetWidth;

  const rightDifference = targetRect.right - rootRight;
  translateX.value = `${rightDifference.toFixed(4)}px - 1em`;
}, 500);

onMounted(alignToTarget);
watch(() => state.mode, alignToTarget);
window.onresize = alignToTarget;
</script>

<template>
  <div ref="target" :class="$style.target" />
  <div ref="root"
    :class="[$style.panel, { [$style.collapse]: !state.expanded, [$style['tiles-mode']]: state.mode === EDITOR_MODE_TILES }]"
    :style="{ ['--translate-x']: translateX }">
    <KeepAlive>
      <Main v-if="state.expanded" />
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
  min-height: 400px;
  max-height: 100%;
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
  }
}
</style>