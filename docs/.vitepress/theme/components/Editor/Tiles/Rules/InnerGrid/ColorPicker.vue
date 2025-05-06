<script lang="ts" setup>
import "vue3-colorpicker/style.css";
import { ColorPicker } from "vue3-colorpicker";
import { EDITOR_3D_EDGES } from "../../../../../composables/constants";
import { ref } from "vue";

const color = defineModel<string>();
const { add } = defineProps<{ add?: boolean, dir: typeof EDITOR_3D_EDGES[number] }>();

const alert = ref<boolean>(false);

const action = () => {

}

const removeAlert = (active: boolean) => alert.value = add ? false : active;
</script>

<template>
  <div :class="[$style['color-picker'], { [$style.add]: add, [$style.alert]: alert }]">
    <b v-if="!add">
      <ColorPicker v-model:color="color" format="hex" shape="square" use-type="pure" disable-alpha theme="black"
        lang="En" blur-close />
    </b>
    <i @click="action" @pointerenter="removeAlert(true)" @pointerleave="removeAlert(false)"
      v-tooltip="{ content: 'Add Edge Color', disabled: !add, distance: 15, delay: { show: 500, hide: 100 } }">
      <v-icon name="fa-plus" />
    </i>
  </div>
</template>

<style module>
.color-picker {
  --neutral: #000;
  --alert: #d72638;

  position: relative;
  z-index: 1;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid var(--neutral);
  border-radius: .3em;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.75);

    i {
      display: flex;
    }
  }

  &.alert {
    border-color: var(--alert);
  }

  b {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  i {
    display: none;
    position: absolute;
    z-index: -1;
    width: 0.75em;
    height: 0.75em;
    justify-content: center;
    align-items: center;
    top: -0.45em;
    left: 1.1em;
    background-color: var(--neutral);
    border-radius: 100%;

    &:hover {
      background-color: var(--alert);
    }
  }

  svg {
    color: var(--text-color);
    transform-origin: center;
    transform: translateX(2.5%) scale(0.5) rotate(45deg);
  }

  &.add {

    i {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--accent-color);
      border-radius: inherit;

      svg {
        color: var(--panel-bg);
        transform: scale(1);
      }
    }
  }
}
</style>

<style>
.vc-colorpicker {
  border-radius: var(--editor-border-radius) !important;
}

.vc-color-wrap {
  box-shadow: unset !important;
  margin-right: unset !important;
  display: block !important;
}

.vc-input-toggle {

  color: var(--text-muted) !important;
  font-weight: 900 !important;

  &::before,
  &::after {
    display: none !important;
  }

  &:hover {
    background: unset !important;
  }
}

.vc-color-input,
.vc-current-color,
.vc-colorPicker__record .color-item {
  border: 1px solid #444 !important;
  border-radius: .2em !important;

  input {
    color: var(--text-color) !important;
  }
}
</style>