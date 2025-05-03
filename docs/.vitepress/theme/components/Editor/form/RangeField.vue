<script setup lang="ts">
import { computed } from 'vue';
import FormGroup from './FormGroup.vue';

const model = defineModel<number>({ required: true, default: 50 });
const { label, step = 1, min = 0, max = 100 } = defineProps<{ label: string, step?: number, min?: number, max?: number }>();

const percent = computed(() => ((model.value - min) / (max - min)))
</script>

<template>
  <FormGroup :label="label">
    <template #input="{ id }">
      <div :class="$style.range">
        <input :id="id" type="range" :step="step" :min="min" :max="max" v-model.number="model" />
        <i />
        <b :style="{ '--content-model': `'${model}'`, '--translate-x': `${percent * 100}%` }" />
      </div>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>

<style module>
.range {
  font-size: 1em;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    padding: 0;
    border: 0;
  }

  i {
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;
    height: .25em;
    background-color: var(--text-muted);
    border-radius: 1em;
    pointer-events: none;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--accent-muted);
      transform: scaleX(v-bind(percent));
      transform-origin: left;
    }
  }

  b {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 0.25em;
    top: 0;
    left: 0;
    transform: translateX(var(--translate-x));
    pointer-events: none;

    &:before {
      font-size: 0.9em;
      display: flex;
      content: "";
      position: absolute;
      justify-content: center;
      align-items: center;
      z-index: -1;
      top: 50%;
      left: 0;
      width: 1em;
      height: 1em;
      color: var(--text-color);
      font-weight: 400;
      border-radius: 100%;
      transform: translate(-50%, -50%);
      background-color: var(--accent-muted);
    }
  }

  &:hover b:before {
    content: var(--content-model);
    width: 2.2em;
    height: 2.2em;
    background-color: var(--input-bg);
    border: 2px solid var(--accent-muted);
  }
}
</style>
