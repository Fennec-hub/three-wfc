<script lang="ts" setup>
defineProps<{ col: boolean }>();
const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
</script>

<template>
  <div :class="[$style['color-picker'], { [$style.col]: col }]">
    <i><v-icon name="fa-plus" :scale="0.7" /></i>
  </div>
</template>

<style module>
.color-picker {
  position: relative;
  width: 1.5em;
  height: 1.5em;
  background-color: v-bind(color);
  border: 1px solid var(--text-muted);
  border-radius: .3em;
  cursor: pointer;
  transition: transform 0.2s ease-out;

  &.col {
    /* width: 1em; */
  }

  &:hover {
    transform: scale(1.2);

    i {
      display: flex;
    }
  }

  i {
    display: none;
    position: absolute;
    width: 1em;
    height: 1em;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    background-color: red;
    border-radius: 0.2em;
  }

  svg {
    color: var(--text-color);
    transform: rotate(45deg);
  }
}
</style>
