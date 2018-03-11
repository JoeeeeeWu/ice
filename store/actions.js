import axios from 'axios';
import Services from './services';

export default {
  async fetchHouses({ state }) {
    const res = await Services.fetchHouses();
    state.houses = res.data.data;
    return res;
  },

  async fetchCharacters({ state }) {
    const res = await Services.fetchCharacters();
    state.characters = res.data.data;
    return res;
  },

  async showHouse({ state }, _id) {
    if (_id === state.currentHouse._id) return;
    const res = await Services.fetchHouse(_id);
    state.currentHouse = res.data.data;
    return res; // eslint-disable-line
  },

  async showCharacter({ state }, _id) {
    if (_id === state.currentCharacter._id) return;
    const res = await Services.fetchCharacter(_id);
    state.currentCharacter = res.data.data;
    return res; // eslint-disable-line
  },

  async fetchProducts({ state }) {
    const res = await Services.fetchProducts();
    state.products = res.data.data;
    return res;
  },

  async saveProduct({ dispatch }, product) {
    await axios.post('/api/products', product);
    const res = await dispatch('fetchProducts');
    return res.data.data;
  },

  async putProduct({ dispatch }, product) {
    await axios.put('/api/products', product);
    const res = await dispatch('fetchProducts');
    return res.data.data;
  },

  async deleteProduct({ dispatch }, product) {
    const {
      _id,
    } = product;
    await axios.delete(`/api/products/${_id}`);
    const res = await dispatch('fetchProducts');
    return res.data.data;
  },
};
