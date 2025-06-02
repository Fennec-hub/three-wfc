<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue';
import { useEditor } from '../../../../composables/editor/useEditor';

import InputField from '../../form/InputField.vue';

const { updateWorld, worlds } = useEditor();

const { id } = defineProps<{ id: number }>();
defineEmits(["close"]);

const name = computed({
  get() {
    return worlds[id].name
  },
  set(name: string) {
    updateWorld(id, { name })
  }
})

const root = useTemplateRef("root");

onMounted(() => root.value!.querySelector('input')?.focus())
</script>

<template>
  <div ref="root">
    <InputField type="text" v-model="name" @keydown.enter="$emit('close')">
      <template #postfix>
        <span class="button-primary" v-tooltip="{ content: 'update', distance: 15 }">
          <v-icon name="fa-regular-edit" @click="$emit('close')" />
        </span>
      </template>
    </InputField>
  </div>
</template>

<style module></style>
