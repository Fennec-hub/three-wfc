<script setup lang="ts">
import FormGroup from './FormGroup.vue';

const model = defineModel<boolean[]>({ required: true, default: [] });

const { label, options } = defineProps<{
  label: string,
  options: [label: string, icon?: string, rotation?: number][],
  column?: boolean
}>();
</script>

<template>
  <FormGroup :label="label" :column="column">
    <template #input>
      <button v-for="([name, icon], i) in options" class="button-action" :key="name" :class="{ active: !!model[i] }"
        @click="model[i] = !model[i]">
        <v-icon v-if="icon" :name="icon" />
        {{ name }}
      </button>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>
