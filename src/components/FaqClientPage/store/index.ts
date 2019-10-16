import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface IRootState {

}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
