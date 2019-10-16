import Vue from 'vue';
import Vuex from 'vuex';
import { fromRoute } from 'sAIFaqClient/common/resourceNavigationUtil';

Vue.use(Vuex);

const localStorageKeyName = 'sAIFaqClient-history';

const cleanObject = obj => {
  const copied = {};
  for (const key of Object.keys(obj)) {
    if (obj[key]) copied[key] = obj[key];
  }
  return copied;
};

const historyStoreCOnfig = {
  state() {
    return {
      list: [],
    };
  },
  mutations: {
    setHistory(state, list) {
      state.list = list;
    },
    async add(state, route) {
      const resourceParam = await fromRoute(route);
      if (resourceParam.talkScript.viewType === 'talkScript') {
        return;
      }
      state.list = state.list.filter(
        item => item.talkScriptId !== route.talkScriptId
      );
      state.list.unshift(cleanObject(route));
      localStorage.setItem(localStorageKeyName, JSON.stringify(state.list));
    },
  },
  getters: {},
  actions: {
    init(context) {
      context.commit(
        'setHistory',
        JSON.parse(localStorage.getItem(localStorageKeyName) || null) || []
      );
    },
  },
  modules: {},
};

export const createHistoryStore = () => {
  const store = new Vuex.Store(historyStoreCOnfig);
  store.dispatch('init');
  return store;
};
