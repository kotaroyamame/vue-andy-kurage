<template>
  <div class="SampleColumn">
    SampleColumn {{ currentValue }} {{ index }}
    <div>active: {{ active }}</div>
    <div>prevValue: {{ prevValue && prevValue.debug }}</div>
    <div>nextValue: {{ nextValue && nextValue.debug }}</div>
    <button
      @click="
        navigationStore.open({ componentName: 'SampleColumn', debug: index })
      "
    >
      Open
    </button>
    <button
      @click="navigationStore.close()"
      v-show="navigationStore.canClose()"
    >
      Close
    </button>
  </div>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  props: {
    currentValue: Object,
    prevValue: Object,
    nextValue: Object,
    navigationStore: Object,
    index: Number,
    active: Boolean,
  },
})
export default class SampleColumn extends Vue {}
</script>
<style lang="scss" scoped></style>
