<script lang="ts" setup>
import { useSlots } from 'vue';

const slots = useSlots();

defineProps<{ label?: string, className?: string, disabled?: boolean, column?: boolean }>();

const _id = `input-${Math.random().toString(36).substring(2, 8)}`;
</script>

<template>
  <div :class="[$style['form-group'], { [$style.column]: column }]">
    <label v-if="label" :for="_id">{{ label }}</label>
    <div :class="[$style['input-group'], className]">
      <slot v-if="slots.prefix" name="prefix" />
      <slot name="input" :id="_id" />
      <slot v-if="slots.postfix" name="postfix" />
    </div>
  </div>
</template>

<style module>
.form-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;

  &.column {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25em;

    label {
      margin: 0 0 0.25em;
    }
  }

  label {
    flex: 0.3;
    font-size: 0.9em;
    font-weight: 500;
    color: var(--text-muted);
    text-align: right;
    min-width: 0;
  }

  input {
    flex: 1;
    background-color: var(--input-bg);
    border: 1px solid #555;
    color: var(--text-color);
    padding: 0.1em 0.5em;
    border-radius: 0.2em;
    font-size: 0.9em;
    min-width: 0;

    &:focus {
      outline: none;
      border-color: var(--accent-color);
    }

    &:placeholder {
      color: #666;
    }
  }
}

.input-group {
  position: relative;
  flex: 0.7;
  display: flex;
  align-items: center;
  gap: 0.5em;
  min-width: 0;
}

.input-postfix-button {
  background-color: var(--accent-color);
  color: var(--panel-bg);
  border: none;
  padding: 0.1em 0.5em;
  border-radius: 0.2em;
  cursor: pointer;
  min-width: 0;

  &:hover {
    background-color: #ffc107;
  }
}
</style>
