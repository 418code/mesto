import {config} from '../utils/constants.js';

export default class UserInfo {
  constructor(profileName, profileDescription) {
    this._profileName = profileName;
    this._profileDescription = profileDescription;
  }

  /**
   * Returns current text content of user information
   * @returns {Object} - {[config.profileInputNameName]: "value", [config.profileInputDescriptionName]: "value"}
   */
  getUserInfo() {
    return {[config.profileInputNameName]: this._profileName.textContent, [config.profileInputDescriptionName]: this._profileDescription.textContent};
  }

  /**
   * Writes user information text to the page
   * @param {Object} data - {name: "", description: ""}
   */
  setUserInfo(data) {
    this._profileName.textContent = data.name;
    this._profileDescription.textContent = data.description;
  }
}