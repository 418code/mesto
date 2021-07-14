import Popup from './Popup.js';
import {config} from '../utils/constants.js';

export default class PopupConfirm extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupForm = this._popup.querySelector(config.popupFormSelector);
    this._submitHandler = null;
    this.setEventListeners();
  }

  /**
   * Sets submit button handler
   * @param {Function} callback - evoked on form submit
   */
  setSubmitHandler(callback) {
    this._submitHandler = callback;
  }

  /**
   * Closes the popup
   */
  close() {
    super.close();
    this._submitHandler = null;
  }

  /**
   * Sets event listeners for the popup
   */
  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener('submit', (evt) => this._submitHandler(evt));
  }
}
