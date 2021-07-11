import {config} from '../utils/constants.js';

export default class UserInfo {
  constructor(info) {
    this._profileName = document.querySelector(info.profileNameSelector);
    this._profileDescription = document.querySelector(info.profileDescriptionSelector);
    this._avatar = document.querySelector(info.profileAvatarSelector);
    this._id = info._id;
    this.setUserAvatar(info.avatar);
  }

  /**
   * Returns current text content of user information
   * @returns {Object} - {[config.profileInputNameName]: "value", [config.profileInputDescriptionName]: "value"}
   */
  getUserInfo() {
    return {[config.profileInputNameName]: this._profileName.textContent,
            [config.profileInputDescriptionName]: this._profileDescription.textContent,
            userId: this._id};
  }

  /**
   * Writes user information text to the page
   * @param {Object} data - {name: "", description: ""}
   */
  setUserInfo(data) {
    this._profileName.textContent = data.name;
    this._profileDescription.textContent = data.description;
  }

  /**
   * Sets the address of user photo
   * @param {String} url
   */
  setUserAvatar(url) {
    this._avatar.src = url;
  }
}
