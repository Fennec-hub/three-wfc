<script lang="ts" setup>
import { computed, ref } from "vue";
import { useEditor } from "../../../../composables/editor/useEditor";
import { Tile2DState } from "../../../../composables/types";
import { REFLECTION_OPTIONS, ROTATION_OPTIONS } from "../../../../composables/constants";

import InputField from "../../form/InputField.vue";
import RangeField from "../../form/RangeField.vue";
import TogglesField from "../../form/TogglesField.vue";
import SwitchField from "../../form/SwitchField.vue";

const { tiles, updateTile } = useEditor();
const { id } = defineProps<{ id: number }>();

const tile2D = computed(() => tiles[id] as Tile2DState);

const name = computed({
  get() { return tile2D.value.name },
  set(name: string) { updateTile(id, { name }) }
});

const weight = computed({
  get() { return tile2D.value.weight },
  set(weight: number) { updateTile(id, { weight }) }
});

const enabled = computed({
  get() { return tile2D.value.enabled },
  set(enabled: boolean) { updateTile(id, { enabled }) }
});

const reflections = computed({
  get() { return [...tile2D.value.reflect] },
  set(reflect: [boolean, boolean]) { updateTile(id, { reflect }) }
});

const rotations = computed({
  get() { return [...tile2D.value.rotation] },
  set(rotation: [one: boolean, two: boolean, three: boolean]) { updateTile(id, { rotation }) }
});
</script>

<template>
  <section>
    <h2>Tile</h2>
    <InputField label="Name" type="text" v-model="name" />
    <SwitchField label="Enabled" v-model="enabled" />
    <RangeField label="Weight" v-model="weight" />
  </section>
  <section>
    <h2>Transformations</h2>
    <TogglesField label="Reflections" v-model="reflections" :column="true" :options="REFLECTION_OPTIONS" />
    <TogglesField label="Rotations" v-model="rotations" :column="true" :options="ROTATION_OPTIONS" />
  </section>
  <section>
    <h2>Sprite</h2>
    <SwitchField label="Animate" v-model="enabled" />
  </section>
</template>

<style module></style>
