<script lang="ts" setup>
import { ref } from 'vue';
import { useDB } from '../../../composables/editor/useDB';

const db = useDB();

const confirmation = ref<boolean>(false);

const refresh = () => location.reload();

const clearAndRefresh = () => {
  db.clear();
  refresh();
}
</script>

<template>
  <div :class="[$style.error, { [$style.alert]: confirmation }]">
    <v-icon name="io-warning" :scale="6" />
    <template v-if="!confirmation">
      <h1>An Error Occurred</h1>
      <p>We're sorry, but there’s a problem with your local data. it might be outdated or corrupted.</p>
      <p>Try refreshing the page. If the problem persist, try clearing your browser cache.</p>
      <b>
        <button class="button-action active" @click="refresh">Refresh</button>
        <button :class="$style.alert" class="button-action active" @click="confirmation = true">Clear Cache</button>
      </b>
    </template>
    <template v-else>
      <h1>Delete Cache</h1>
      <p>This will permanently delete all locally stored projects and reset the application cache.</p>
      <p>Are you sure you want to proceed?</p>
      <button :class="$style.alert" class="button-action active" @click="clearAndRefresh">Confirm</button>
    </template>
  </div>
</template>

<style module>
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1em;

  svg {
    color: var(--accent-color);
  }

  h1 {
    font-size: 1.5em;
    font-weight: 700;
    margin: 1em 0;
  }

  p {
    margin: 1em 0;
  }

  b {
    display: flex;
    gap: 1em;
  }

  button {
    margin: 1em auto 0.5em;
    font-size: 1em;
    font-weight: 700;
    background-color: var(--accent-color) !important;
    border-color: var(--accent-color) !important;

    &.alert {
      background-color: var(--alert-color) !important;
      border-color: var(--alert-color) !important;
    }
  }

  &.alert {
    svg {
      color: var(--alert-color);
    }
  }
}
</style>
