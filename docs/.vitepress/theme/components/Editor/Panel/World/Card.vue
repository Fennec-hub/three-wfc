<script lang="ts" setup>
import { ref } from 'vue';
import { useEditor } from '../../../../composables/editor/useEditor';
import { WORLD_TYPES } from '../../../../composables/constants';
import { vOnClickOutside } from '@vueuse/components'
import RemoveWorld from './Remove.vue';
import EditWorld from './Edit.vue';

const { state, selectWorld, worlds } = useEditor();

const props = defineProps<{ id: number }>();

const world = worlds[props.id];

const editMode = ref<boolean>(false);
const deleteMode = ref<boolean>(false);

const closeEditMode = () => editMode.value = false;
const closeDeleteMode = () => deleteMode.value = false;
</script>

<template>
  <div :class="[$style.world, { [$style.selected]: state.selectedWorld === id }]" @click="selectWorld(id)">

    <RemoveWorld v-if="deleteMode" :class="$style.overlay" :id="id" @click.stop @close="closeDeleteMode"
      v-on-click-outside="closeDeleteMode" />

    <h3>
      <v-icon name="gi-earth-africa-europe" />
      <EditWorld v-if="editMode" :id="id" @click.stop @close="closeEditMode" v-on-click-outside="closeEditMode" />
      <template v-else>
        {{ world.name }}
        <b>
          <i @click.stop="editMode = true"><v-icon name="fa-regular-edit" /></i>
          <i @click.stop="deleteMode = true"><v-icon name="fa-trash-alt" /></i>
        </b>
      </template>
    </h3>
    <p>
      <img v-if="world.thumb" :src="world.thumb" :key="world.thumb" />
      <u v-else />
    </p>
    <b>
      <i><v-icon :name="WORLD_TYPES[world.type].icon" /> {{ WORLD_TYPES[world.type].name }}</i>
      <i><v-icon name="hi-solid-puzzle" /> {{ world.tiles }} tiles</i>
    </b>
  </div>
</template>

<style module>
.world {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--vp-c-bg-clear);
  border: 1px solid #555;
  border-radius: 0.4em;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.2s ease, border-color 0.2s ease;
  will-change: transform, border-color;

  &:hover {
    border-color: var(--text-color);
    transform: scale(1.025);
  }

  &.selected {
    border-color: var(--accent-color);
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.25em;
    padding: 0.25em 0.5em;
    font-weight: 500;

    b {
      display: flex;
      align-items: center;
      gap: 0.25em;
      margin: 0 0 0 auto;
    }

  }

  u {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 21/9;
    background-color: #e5e5f7;
    opacity: 0.8;
    background-image: linear-gradient(30deg, #000000 12%, transparent 12.5%, transparent 87%, #000000 87.5%, #000000), linear-gradient(150deg, #000000 12%, transparent 12.5%, transparent 87%, #000000 87.5%, #000000), linear-gradient(30deg, #000000 12%, transparent 12.5%, transparent 87%, #000000 87.5%, #000000), linear-gradient(150deg, #000000 12%, transparent 12.5%, transparent 87%, #000000 87.5%, #000000), linear-gradient(60deg, #00000077 25%, transparent 25.5%, transparent 75%, #00000077 75%, #00000077), linear-gradient(60deg, #00000077 25%, transparent 25.5%, transparent 75%, #00000077 75%, #00000077);
    background-size: 20px 35px;
    background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
  }

  >b {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: var(--text-color);
    background-color: #1119;
    padding: 0.25em 0.5em;
  }

  i {
    font-style: normal;
  }

  img {
    aspect-ratio: 21/9;
  }
}

.overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  font-size: 0.9em;
  padding: 0.5em;
  text-align: center;
  color: var(--text-color);
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1119;
  backdrop-filter: blur(5px);
}
</style>
