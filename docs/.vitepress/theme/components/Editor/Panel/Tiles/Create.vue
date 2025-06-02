<script lang="ts" setup>
import { ref } from 'vue';
import { useEditor } from '../../../../composables/editor/useEditor';
import Loader from '../Loader.vue';
import UploadField from "../../form/UploadField.vue"

const { createTiles2D } = useEditor();

defineProps<{ icon?: string, title?: boolean, size?: string }>()
const uploading = ref<boolean>(false);

const onChange = (files: File[]) => {
  if (!files.length) return;

  uploading.value = true;
  createTiles2D(files).then(() => uploading.value = false);
}
</script>

<template>
  <div :class="$style.create">
    <h1 v-if="title">Upload your First Tiles</h1>
    <Loader v-if="uploading" :scale="4" />
    <UploadField v-else :icon="icon" :size="size || '6em'" accept="image/*" multiple @change="onChange" />
  </div>
</template>

<style module>
.create {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
