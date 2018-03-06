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
};
