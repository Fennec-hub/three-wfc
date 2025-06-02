<script setup lang="ts">
import FormGroup from './FormGroup.vue';

const { label } = defineProps<{ label?: string, icon?: string, accept?: string, multiple?: boolean, size?: string }>();
const emit = defineEmits(["change"]);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  emit('change', files);
}
</script>

<template>
  <FormGroup :label="label">
    <template #input="{ id }">
      <div :class="$style.upload" :style="{ minHeight: size }">
        <input :id="id" type="file" @change="onChange" :accept="accept" :multiple="multiple" title="" />
        <v-icon :name="icon || 'fa-plus'" :scale="2.5" />
      </div>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>

<style module>
.upload {
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: calc(100% - 6px);
  height: calc(100% - 6px);
  aspect-ratio: 1;
  margin: 0 1em 0 0;
  color: var(--accent-color);
  border: 2px dashed var(--accent-color);
  border-radius: var(--editor-border-radius);
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: var(--accent-color);
    color: var(--panel-bg);
  }

  input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
