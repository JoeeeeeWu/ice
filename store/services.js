import axios from 'axios';

const baseUrl = '';

class Services {
  fetchHouses() {
    return axios.get(`${baseUrl}/wiki/houses`);
  }

  fetchCharacters() {
    return axios.get(`${baseUrl}/wiki/characters`);
  }

  fetchHouse(id) {
    return axios.get(`${baseUrl}/wiki/houses/${id}`);
  }

  fetchCharacter(id) {
    return axios.get(`${baseUrl}/wiki/characters/${id}`);
  }

  fetchProducts() {
    return axios.get(`${baseUrl}/api/products`);
  }
}

export default new Services();
