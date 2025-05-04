<script setup lang="ts">
import FormGroup from './FormGroup.vue';

export type ToggleFieldOption = { label: string, icon?: string, rotation?: number, tooltip?: string };
const model = defineModel<boolean[]>({ required: true, default: [] });

const { label, options } = defineProps<{
  label: string,
  options: ToggleFieldOption[],
  column?: boolean
}>();
</script>

<template>
  <FormGroup :label="label" :column="column">
    <template #input>
      <button v-for="({ label, icon, tooltip }, i) in options" class="button-action" :key="label"
        :class="{ active: !!model[i] }"
        v-tooltip="{ content: tooltip, distance: 15, enabled: !!tooltip, delay: { show: 500, hide: 100 } }"
        @click="model[i] = !model[i]">
        <v-icon v-if="icon" :name="icon" />
        {{ label }}
      </button>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>
