<script lang="ts" setup>
import { ref } from 'vue';
import { useEditor } from '../../../../composables/editor/useEditor';
import WorldCreate from './Create.vue';
import WorldCard from './Card.vue';

const { worldsCount, worlds } = useEditor();
const createMode = ref<boolean>(!worldsCount.value);
</script>

<template>
  <WorldCreate v-if="!worldsCount || createMode" @close="createMode = false" />
  <div :class="$style.worlds" v-else>
    <WorldCard v-for="{ id } in worlds" :id="id" :key="id" />
    <button class="button-action active" @click="createMode = true"><v-icon name="fa-plus" /> Create New World</button>
  </div>
</template>

<style module>
.worlds {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
