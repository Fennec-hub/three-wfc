<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import { useEditor } from '../../../../composables/editor/useEditor';
import InputField from '../../form/InputField.vue';
import { WorldType } from '../../../../composables/types';
import { EDITOR_MODE_TILES, WORLD_TYPES } from '../../../../composables/constants';
import Logo from '../Logo.vue';

const { worldsCount, createWorld, selectWorld } = useEditor();

const emit = defineEmits(["close"]);

const input = useTemplateRef("input")
const name = ref<string>(!worldsCount.value ? 'My first world' : `New World ${worldsCount.value + 1}`);

const createNewWorld = (type: WorldType) => {
  const worldName = name.value ? name.value.trim() : `My first Three WFC ${WORLD_TYPES[type].name} world`;

  createWorld({
    type,
    name: worldName,
    mode: EDITOR_MODE_TILES,
    cols: 20,
    rows: 20,
    tile: null,
    zoom: 1,
    viewport: [20, 20],
    tiles: 0
  });
  emit('close');
};

const close = () => {
  selectWorld(null);
  emit("close");
}

onMounted(() => {
  if (!worldsCount.value && input.value)
    input.value.$el.querySelector('input')?.focus();

  selectWorld(null);
})
</script>

<template>
  <div :class="$style.create">
    <b v-if="worldsCount" @click="emit('close')">
      <i>
        <v-icon name="md-arrowforwardios-round" flip="horizontal" /> My Worlds
      </i>
    </b>
    <Logo />
    <h1>Create a new world</h1>
    <InputField ref="input" v-model="name" type="text" :placeholder="`World's name`" />
    <p>
      <button v-for="({ name, icon }, _, index) in WORLD_TYPES" class="button-action active"
        :class="{ [$style.disabled]: index == 2 }" :key="index" @click="createNewWorld(index as WorldType)"
        v-tooltip="{ content: index == 2 ? '🚧 <b>WIP</b> 🚧' : `Create a <b>${name}</b> world`, distance: 15, html: true, placement: index < 2 ? 'top' : 'bottom' }">
        <v-icon :name="icon" :scale="1.8" />
        {{ name }}
      </button>
      <button class="button-action active"
        v-tooltip="{ content: '<b>Import</b> your world', distance: 15, placement: 'bottom', html: true }"><v-icon
          name="fa-upload" :scale="1.8" /> Import
        <input type="file" multiple title="" />
      </button>
    </p>
  </div>
</template>

<style module>
.create {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5em;

  b {
    margin: -1em -1em 0;
    padding: 0 1em 0.5em;
    border-bottom: 1px solid #444;
    cursor: pointer;
    transition: transform .1s ease, color .1s ease;
    will-change: transform, color;

    &:hover {
      color: var(--accent-color);
      transform: translateX(-0.25em);
    }
  }

  >h1 {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--accent-color);
    text-align: center;
  }

  p {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
    margin: 0.25em 0 0;
    padding: 0.25em 0;
  }

  input {
    text-align: center;
  }

  button {
    position: relative;
    display: flex;
    flex-direction: column;
    font-weight: 700 !important;
    background-color: var(--accent-color) !important;

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }

  i {
    font-style: normal;
  }
}

.disabled {
  --strips-color: #060606;
  background-color: var(--accent-color);
  background: repeating-linear-gradient(-45deg, var(--strips-color), var(--strips-color) 2px, var(--accent-color) 2px, var(--accent-color) 10px);
}
</style>
