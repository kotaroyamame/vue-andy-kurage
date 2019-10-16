import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    navigationStore: Object,
    autocompleteStore: Object,
    historyStore: Object,
  },
})
export default class FaqClientMixin extends Vue {}
