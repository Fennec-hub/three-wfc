<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useEditor } from '../../../../composables/editor/useEditor';
import CreateTile from './Create.vue';
import TileParams from './Params.vue';
import Transformer from './Transformer.vue';
import TogglesField from '../../form/TogglesField.vue';

const { tilesCount, state } = useEditor();


</script>

<template>
  <CreateTile v-if="!tilesCount" size="8em" icon="fa-upload" title />
  <template v-else>
    <div>
      <Transformer :id="state.selectedTile!" />
      <TileParams :id="state.selectedTile!" />
    </div>
  </template>

</template>
