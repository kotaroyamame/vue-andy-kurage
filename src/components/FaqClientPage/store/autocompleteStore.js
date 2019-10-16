import Vue from 'vue';
import Vuex from 'vuex';
import dataResource from '../common/dataResource';
import search from '../common/search';

Vue.use(Vuex);

const autoCompleteStoreConfig = {
  state() {
    return {
      caption: 'データ取得中',
      show: false,
      result: [],
      showFaqTitle: true,
    };
  },
  mutations: {
    toggleShow(state, value) {
      state.show = value;
    },
    setResult(state, result) {
      state.result = result;
    },
    // TODO: これほアクションにしないといけない
    async setSearchText(state, searchText) {
      const ids = await search.search(searchText || null);
      if (!searchText) {
        state.result =
          ids &&
          ids.map(talkScriptId => {
            return dataResource.getItemSync({
              resourceName: 'talkScript',
              talkScriptId,
            });
          });
        state.caption = '良くある質問';
      } else if (ids.length > 0) {
        state.result =
          ids &&
          ids.map(talkScriptId => {
            return dataResource.getItemSync({
              resourceName: 'talkScript',
              talkScriptId,
            });
          });
        state.caption = `${ids.length}件の質問が見つかりました`;
      } else {
        state.result = [];
        state.caption =
          '該当する質問はありませんでした。違う質問文を試してください。';
      }
    },
  },
  getters: {},
  actions: {
    async init(context) {
      context.commit('setSearchText');
    },
  },
  modules: {},
};

export const createAutocompleteStore = () => {
  const store = new Vuex.Store(autoCompleteStoreConfig);
  store.dispatch('init');
  return store;
};
