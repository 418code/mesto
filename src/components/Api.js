export default class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  /**
   * Sends a network request with given parameters
   * @param {String} path - the last part of full url
   * @param {String} method - 'GET || 'POST' || 'PATCH' || 'PUT' || 'DELETE'
   * @param {String} body - is added with some methods
   * @returns {Promise}
   */
  _fetchPath(path, method, body = {}) {
    const fetchObject = {
      method: method,
      headers: this.headers,
    }
    if (method === 'POST' || method === 'PATCH')
      fetchObject['body'] = JSON.stringify(body);

    return fetch(`${this.baseUrl}${path}`, fetchObject)
    .then(res => {
      if (res.ok)
        return res.json();
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  /**
   * Gets user profile information
   * @returns {Promise}
   */
  getUserInfo() {
    return this._fetchPath('users/me', 'GET');
  }

  /**
   * Sets user profile information
   * @param {Object} object - {name, about}
   * @returns {Promise}
   */
  setUserInfo({ name, about }) {
    return this._fetchPath('users/me', 'PATCH', {name: name, about: about});
  }

  /**
   * Tries to save a link to a new user avatar to the server
   * @param {String} url
   * @returns {Promise}
   */
  setUserAvatar(url) {
    return this._fetchPath('users/me/avatar', 'PATCH', {avatar: url});
  }

  /**
   * Loads cards from the server
   * @returns {Promise}
   */
  getInitialCards() {
    return this._fetchPath('cards', 'GET');
  }

  /**
   * Adds a new card to the server
   * @param {Object} object - {name, link}
   * @returns {Promise} - contains new card data
   */
  addCard({ name, link }) {
    return this._fetchPath('cards', 'POST', {name: name, link: link});
  }

  /**
   * Removes card from server
   * @param {String} cardId
   * @returns {Promise}
   */
  deleteCard(cardId) {
    return this._fetchPath(`cards/${cardId}`, 'DELETE')
  }

  /**
   * Adds a like to a card
   * @param {String} cardId
   * @returns {Promise}
   */
  likeCard(cardId) {
    return this._fetchPath(`cards/likes/${cardId}`, 'PUT');
  }

  /**
   * Removes a card's like from the server
   * @param {String} cardId
   * @returns {Promise}
   */
  unlikeCard(cardId) {
    return this._fetchPath(`cards/likes/${cardId}`, 'DELETE');
  }
}
