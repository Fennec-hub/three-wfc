<script lang="ts" setup>
import { useEditor } from '../../../../composables/editor/useEditor';

defineProps<{ id: number }>();
defineEmits(["close"]);
const { removeWorld } = useEditor();
</script>

<template>
  <div :class="$style.alert">
    <v-icon name="io-warning" :scale="2" />
    <p>This will permanently delete this <b>World</b>, all its <b>Tiles</b> and <b>Grid configuration</b></p>
    <b>
      <button class="button-action active" @click="$emit('close')"><v-icon name="md-arrowforwardios-round"
          flip="horizontal" />
        Abort</button>
      <button class="button-action active alert" @click="removeWorld(id)"><v-icon name="fa-trash-alt" />Delete</button>
    </b>
  </div>
</template>

<style module>
.alert {
  >svg {
    color: var(--alert-color)
  }

  >b {
    text-decoration: none;
    display: flex;
    gap: 1em;
  }
}
</style>
