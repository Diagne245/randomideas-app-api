import axios from 'axios';

class IdeasAPI {
  constructor() {
    this._apiUrl = '/api/ideas';

    this.getIdeas();
  }

  getIdeas() {
    return axios.get(this._apiUrl);
  }

  addIdea(idea) {
    return axios.post(this._apiUrl, idea);
  }

  updateIdea(id, data) {
    return axios.put(`${this._apiUrl}/${id}`, data);
  }

  deleteIdea(id, username) {
    return axios.delete(`${this._apiUrl}/${id}`, {
      data: {
        username,
      },
    });
  }
}

export default new IdeasAPI();
