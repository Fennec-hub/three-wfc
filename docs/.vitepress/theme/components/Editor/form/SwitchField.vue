<script setup lang="ts">
import FormGroup from './FormGroup.vue';

const model = defineModel<boolean>();
const { label, on = "ON", off = "OFF" } = defineProps<{ label: string, on?: string, off?: string }>();
</script>

<template>
  <FormGroup :label="label">
    <template #input="{ id }">
      <div :class="$style.switch">
        <b>{{ on.length > off.length ? on : off }}</b>
        <input :id="id" type="checkbox" v-model="model" />
        <u>{{ off }}</u>
        <i :class="[$style.toggle, { [$style.active]: model }]">{{ on }}</i>
      </div>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>

<style module>
.switch {
  font-size: 0.8em;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 2em;
  padding: 0 2em;
  text-align: right;
  color: var(--text-muted);
  background: var(--input-bg);
  border: 1px solid #444;
  border-radius: 5em;
  cursor: pointer;
  font-weight: 500;

  b {
    visibility: hidden;
    margin: 0 0.25em 0 0;
  }

  input {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  u {
    position: absolute;
    left: 3em;
    text-decoration: none;
  }
}

.toggle {
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  padding: 0 1em;
  color: var(--panel-bg);
  border-radius: 10em;
  text-align: left;
  font-style: normal;
  background-color: var(--input-bg);
  transform: translateX(calc(-100% + 2em - 4px));
  transition: background-color 0.2s ease-in, transform 0.2s ease-in;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: auto;
    aspect-ratio: 1;
    border-radius: 10em;
    background-color: var(--text-muted);
    transition: background-color 0.2s ease-in, transform 0.2s ease-in;
  }

  &.active {
    background-color: var(--accent-muted);
    transform: translateX(0);

    &:after {
      background-color: var(--input-bg);
      transform: scale(1.1);
    }
  }
}
</style>
