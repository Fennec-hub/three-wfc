<script lang="ts" setup>

</script>

<template>
  <div :class="$style.actions">
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
</template>

<style module>
.actions {
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  background-color: var(--accent-color);
  margin: auto 0 -1em;
  border-radius: 0 0 var(--editor-border-radius) var(--editor-border-radius);

  button {
    position: relative;
    flex: 1;
    padding: 0.5em 0;
    background-color: var(--accent-muted) !important;

    &:hover,
    &:focus {
      background-color: var(--accent-color) !important;
    }

    &:before {
      content: "";
      position: absolute;
      top: 20%;
      right: 0;
      width: 1px;
      height: 60%;
      background-color: var(--panel-bg);
    }

    &:last-child:before {
      display: none;
    }
  }
}
</style>
