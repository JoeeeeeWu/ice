import axios from 'axios';

const baseUrl = '';

class Services {
  fetchHouses() {
    return axios.get(`${baseUrl}/wiki/houses`);
  }

  fetchCharacters() {
    return axios.get(`${baseUrl}/wiki/characters`);
  }
}

export default new Services();
