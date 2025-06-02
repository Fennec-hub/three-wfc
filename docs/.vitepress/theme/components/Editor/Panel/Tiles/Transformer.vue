<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import { Cropper } from 'vue-advanced-cropper'
import { useEditor } from '../../../../composables/editor/useEditor';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { Tile2DState, TileCrop } from '../../../../composables/types';
import Loader from '../Loader.vue';
import { wrap } from '../../../../composables/editor/utils/wrap';

const { id } = defineProps<{ id: number }>();

const { tiles, updateTileImage } = useEditor();

const tile = computed(() => (tiles[id] as Tile2DState));
const original = computed(() => tile.value.original);

const cropperProps = ref<any>({
  stencilProps: {
    handlers: {},
    movable: true,
    resizable: false,
    aspectRatio: 1,
  },

});

const updateParams = () => {
  const val = tile.value;
  const size = Math.min(val.width, val.height)
  const crop = val.crop;
  Object.assign(cropperProps.value, {
    stencilSize: {
      width: size,
      height: size
    },
    defaultPosition: { left: crop.x, top: crop.y }, defaultSize: {
      width: crop.size,
      height: crop.size
    },
    defaultTransforms: {
      rotate: val.rotate * 90,
      flip: {
        horizontal: val.flip.x,
        vertical: val.flip.y,
      }
    }
  });
}
updateParams();

const isInitializing = ref(true);
const ready = ref<boolean>(false);
const cropper = useTemplateRef("cropper");

watch(() => tile.value.original, () => {
  updateParams();
  isInitializing.value = true;
  ready.value = false;
});

const onchange = (event: any) => {
  if (isInitializing.value) {
    isInitializing.value = false;
    return;
  }
  updateTileImage(id, event);
}

const rotate = async (angle: number) => cropper.value!.rotate(angle * 90);
const flip = async (horizontal: boolean) => cropper.value!.flip(horizontal, !horizontal);

const actions: [onClick: () => void, icon: string, tooltip: string, style?: any][] = [
  [() => flip(true), "md-flip-round", 'Flip Horizontally'],
  [() => flip(false), "md-flip-round", 'Flip Vertically', 'rotate(90deg)'],
  [() => rotate(1), "md-rotateright-round", 'Rotate Right'],
  [() => rotate(-1), "md-rotateright-round", 'Rotate Left', "scaleY(-1)"]
];
</script>

<template>
  <div :class="$style.transform">
    <Loader v-if="!ready" :class="$style.loader" :scale="5" />
    <Cropper class="cropper" ref="cropper" :src="original" v-bind="cropperProps" @ready="ready = true"
      @change="onchange" />
    <div :class="$style.actions">
      <button v-for="[onClick, icon, tooltip, transform] in actions" @click.stop="onClick"
        v-tooltip="{ content: tooltip, distance: 15, placement: 'left' }">
        <v-icon :name="icon" :style="{ transform }" />
      </button>
    </div>
  </div>
</template>

<style module>
.transform {
  /* flex: 1; */
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 14em;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.actions {
  position: absolute;
  top: 1em;
  left: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 1em;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    padding: 0.5em;
    color: #fff;
    background-color: #1115;
    border-radius: 100%;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
      color: var(--panel-bg);
      background-color: var(--accent-color);
    }
  }
}
</style>

<style>
.vue-advanced-cropper__background,
.vue-advanced-cropper__foreground {
  background: var(--vp-c-bg-soft);
}

.vue-rectangle-stencil--movable:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  transform: translate(-50%, -50%);
  border: 2px solid var(--accent-color);
  pointer-events: none;
}
</style>