<script lang="ts" setup>
import InputField from "../form/InputField.vue"
import SwitchField from "../form/SwitchField.vue";
import RangeField from "../form/RangeField.vue";
import { ref } from "vue";
import TogglesField from "../form/TogglesField.vue";

const weight = ref<number>(50);
const reflections = ref<boolean[]>([true, false]);
const rotations = ref<boolean[]>([false, true, false]);

</script>

<template>
  <section>
    <h2>Display</h2>
    <InputField label="Cols" />
    <InputField label="Rows" />
    <InputField label="Cell size" />
    <SwitchField label="Grid" />
    <RangeField label="Weight" v-model="weight" />
    <TogglesField label="Reflections" v-model="reflections" :column="true"
      :options="[['Horizontal', 'fa-arrows-alt-h'], ['Vertical', 'fa-arrows-alt-h', 90]]" />
    <TogglesField label="Rotations" v-model="rotations" :column="true"
      :options="[['90°', 'md-rotateright-round'], ['180°', 'md-rotateright-round'], ['270°', 'md-rotateright-round']]" />
  </section>

  <section>
    <h2>Generator</h2>
    <InputField label="Seed">
      <template #postfix>
        <span class="button-primary" v-tooltip="{ content: 'Generate a new Seed', distance: 15 }">
          <v-icon name="fa-seedling" />
        </span>
      </template>
    </InputField>
    <InputField label="Delay (ms)" />

    <div class="button-group2">
      <button class="button-primary">
        <v-icon name="fa-step-forward" />
        Step
      </button>
      <button class="button-primary">
        <v-icon name="fa-fast-forward" />
        Collapse
      </button>
      <button class="button-primary">
        <v-icon name="fa-sync-alt" />
        Reset
      </button>
    </div>
  </section>

  <section>
    <h2>Performances</h2>
    <ul :class="$style.performance">
      <li>
        <i>Tiles</i><b>36</b>
      </li>
      <li>
        <i>Cells</i><b>1600</b>
      </li>
      <li>
        <i>Last Step</i><b> 0.54 ms</b>
      </li>
      <li>
        <i>Avg Step</i><b> 0.075 ms</b>
      </li>
      <li>
        <i>Total Steps</i><b>1335</b>
      </li>
      <li>
        <i>Total Time</i><b>155.700 ms</b>
      </li>
    </ul>
  </section>

  <i :class="$style.status">Collapse completed</i>
</template>

<style module>
.performance {
  font-size: 0.9em;
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    gap: 0.5em;
  }

  i {
    flex: 0.3;
    min-width: 0;
    font-style: normal;
    text-align: right;
    color: var(--text-muted);

  }

  b {
    flex: 0.7;
    font-weight: 400;
    font-weight: normal;
    color: var(--vp-c-yellow-muted);
  }
}

.status {
  position: relative;
  margin: auto 0 0;
  padding: 0.5em 0 0.25em;
  text-align: center;
  color: var(--text-muted);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 15%;
    width: 70%;
    height: 1px;
    background-color: #fff2;
  }
}
</style>
