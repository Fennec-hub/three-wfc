<script setup lang="ts">
import { DeepReadonly } from 'vue';
import FormGroup from './FormGroup.vue';

export type ToggleFieldOption = { label: string, icon?: string, rotation?: number, tooltip?: string };
const model = defineModel<boolean[] | number>({ required: true, default: [] });

const { label, options } = defineProps<{
  options: DeepReadonly<ToggleFieldOption[]>,
  label?: string,
  column?: boolean,
}>();

const emit = defineEmits(["change"]);

const update = (index: number) => {
  Array.isArray(model.value)
    ? model.value.splice(index, 1, !model.value[index])
    : model.value = index;

  emit('change', model.value);
}
</script>

<template>
  <FormGroup :label="label" :column="column">
    <template #input>
      <button v-for="({ label, icon, tooltip, rotation }, i) in options" class="button-action" :key="label"
        :class="{ active: Array.isArray(model) ? !!model[i] : model === i }"
        v-tooltip="{ content: tooltip, distance: 15, disabled: !tooltip, delay: { show: 500, hide: 100 } }"
        @click="update(i)">
        <v-icon v-if="icon" :name="icon" :style="{ transform: `rotate(${rotation || 0}deg)` }" />
        {{ label }}
      </button>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>
