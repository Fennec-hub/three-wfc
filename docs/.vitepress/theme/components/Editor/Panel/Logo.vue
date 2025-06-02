<template>
  <div :class="$style.logo">
    <v-icon name="three-wfc" :scale="5" />
    <h1>Three-WFC</h1>
  </div>
</template>

<style module>
.logo {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1em 0 0;
  text-align: center;

  h1 {
    color: var(--text-color) !important;
    width: 60%;
    padding: 0 0 1em;
  }

  i {
    font-style: normal;
  }
}
</style>
