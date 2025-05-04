<script lang="ts" setup>
import { EDITOR_SECTIONS } from '../../../composables/constants';
import { useEditor } from '../../../composables/editor/useEditor';

const { expand } = useEditor();
</script>

<template>
  <div :class="$style.collapsed">
    <u>
      <i v-for="({ name, icon }, index) in EDITOR_SECTIONS" @click="expand(true, index)"
        v-tooltip.right-start="{ content: name, placement: 'left', distance: 15 }">
        <v-icon :name="icon" />
      </i>
    </u>
    <u>
      <b v-tooltip.right-start="{ content: 'Step', placement: 'left', distance: 15 }"><v-icon
          name="fa-step-forward" /></b>
      <b v-tooltip.right-start="{ content: 'Collapse', placement: 'left', distance: 15 }"><v-icon
          name="fa-fast-forward" /></b>
      <b v-tooltip.right-start="{ content: 'Reset', placement: 'left', distance: 15 }"><v-icon name="fa-sync-alt" /></b>
    </u>
  </div>
</template>

<style module>
.collapsed {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;

  u {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 0 0.5em;
    /* border-bottom: 1px solid #fff2; */

    &:first-child:before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 160%;
      height: 1px;
      background-color: #fff4;
      border-radius: 3px;
      transform: translateX(-50%);
    }
  }

  i,
  b {
    margin: .5em 0;
    color: var(--text-color);
    transition: color 0.2s ease;
    cursor: pointer;
    transform: scale(1.3);

    &:hover {
      color: var(--accent-color);
    }
  }

  b {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.75em;
    height: 1.75em;
    background-color: var(--accent-muted);
    color: var(--vp-c-bg-soft);
    border-radius: 0.3em;
    transform: scale(1);

    &:hover {
      background-color: var(--accent-color);
      color: var(--vp-c-bg-soft);
      transform: scale(0.95);
    }
  }
}
</style>
