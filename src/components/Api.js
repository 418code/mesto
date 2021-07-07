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
  _fetchPath(path, method, body = '') {
    const fetchObject = {
      method: method,
      headers: this.headers,
    }
    if (method === 'POST' || method === 'PATCH')
      fetchObject['body'] = body;

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
    return this._fetchPath('users/me', 'PATCH', JSON.stringify({name: name, about: about}));
  }
}
