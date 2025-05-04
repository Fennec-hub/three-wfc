<script lang="ts" setup>

</script>

<template>
  <div :class="$style['tiles-grid']">
    <div :class="$style.center">
      <h1>center</h1>
    </div>
    <div :class="$style.top">
      <h1>top</h1>
    </div>
    <div :class="$style.right">
      <h1>right</h1>
    </div>
    <div :class="$style.bottom">
      <h1>bottom</h1>
    </div>
    <div :class="$style.left">
      <h1>left</h1>
    </div>
  </div>
</template>

<style module>
.tiles-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: 0.5em;
  align-items: center;
  justify-items: center;
  position: relative;
  min-width: 0;
  min-height: 0;

  >* {
    background-color: aquamarine;
  }

  &:after {
    content: "";
    position: absolute;
    top: calc(-1em - 4px);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #777;
  }
}

.center {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.top {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  height: 15%;
}

.right {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.bottom {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.left {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
</style>
