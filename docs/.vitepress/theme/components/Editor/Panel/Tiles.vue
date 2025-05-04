<script lang="ts" setup>
import { ref } from "vue";
import InputField from "../form/InputField.vue"

import RangeField from "../form/RangeField.vue";
import TogglesField from "../form/TogglesField.vue";
import SwitchField from "../form/SwitchField.vue";

const reflectionOptions = [
  { label: 'Horizontal', icon: 'fa-arrows-alt-h', tooltip: "Mirror on the X axis" },
  { label: 'Vertical', icon: 'fa-arrows-alt-h', rotation: 90, tooltip: "Mirror on the Y axis" }
];

const rotationOptions = [
  { label: '90°', icon: 'md-rotateright-round', tooltip: "Rotate 90° clockwise" },
  { label: '180°', icon: 'md-rotateright-round', tooltip: "Rotate 180° clockwise" },
  { label: '270°', icon: 'md-rotateright-round', tooltip: "Rotate 270° clockwise" }
]

const weight = ref<number>(50);
const enabled = ref<boolean>(true);
const reflections = ref<boolean[]>([true, false]);
const rotations = ref<boolean[]>([false, true, false]);
</script>

<template>
  <div>
    <section>
      <h2>Tile</h2>
      <InputField label="Name" />
      <SwitchField label="Enabled" v-model="enabled" />
      <RangeField label="Weight" v-model="weight" />
    </section>
    <section>
      <h2>Transformations</h2>
      <TogglesField label="Reflections" v-model="reflections" :column="true" :options="reflectionOptions" />
      <TogglesField label="Rotations" v-model="rotations" :column="true" :options="rotationOptions" />
    </section>
  </div>
</template>

<style module></style>
