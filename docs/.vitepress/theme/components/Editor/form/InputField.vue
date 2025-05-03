<script setup lang="ts">
import FormGroup from './FormGroup.vue';

const model = defineModel<number | string>();

const { label, type = 'number', placeholder } = defineProps<{
  label: string,
  type?: string,
  placeholder?: string
}>();
</script>

<template>
  <FormGroup :label="label">
    <template #input="{ id }">
      <input :id="id" :type="type" v-model="model" :placeholder="placeholder" />
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>
