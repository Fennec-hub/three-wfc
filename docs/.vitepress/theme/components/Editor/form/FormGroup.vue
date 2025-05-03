<script lang="ts" setup>
import { useSlots } from 'vue';

const slots = useSlots();

defineProps<{ label: string, className?: string, disabled?: boolean, column?: boolean }>();

const _id = `input-${Math.random().toString(36).substring(2, 8)}`;
</script>

<template>
  <div class="form-group" :class="{ column }">
    <label :for="_id">{{ label }}</label>
    <div class="input-group" :class="className">
      <slot v-if="slots.prefix" name="prefix" />
      <slot name="input" :id="_id" />
      <slot v-if="slots.postfix" name="postfix" />
    </div>
  </div>
</template>
