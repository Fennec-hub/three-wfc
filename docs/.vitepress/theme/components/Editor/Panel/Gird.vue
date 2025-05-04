<script lang="ts" setup>
import InputField from "../form/InputField.vue"
import SwitchField from "../form/SwitchField.vue";
</script>

<template>
  <div>
    <section>
      <h2>Display</h2>
      <InputField label="Cols" />
      <InputField label="Rows" />
      <InputField label="Cell size" />
      <SwitchField label="Grid" />
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
    </section>

    <section :class="$style.blank">
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
  </div>
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
    color: var(--vp-c-yellow-2);
  }
}

.status {
  font-size: 0.9em;
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

.blank {
  background-color: transparent !important;
}
</style>
