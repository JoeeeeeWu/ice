import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';

const createStore = () => new Vuex.Store({
  state: {
    houses: [],
    characters: [],
    currentHouse: {},
    currentCharacter: {},
    products: [],
  },
  actions,
  mutations,
});

export default createStore;
