import {config} from '../utils/constants.js';

export default class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._closeButton = this._popup.querySelector(config.popupCloseButtonSelector);
  }

  /**
   * Escape button press handler
   * @param {Event} evt
   */
  _handleEscClose = (evt) => {
    if (evt.key === "Escape")
      this.close();
  }

  /**
   * Side button click handler
   * @param {Event} evt
   */
  _handleSideClickClose = (evt) => {
    if (evt.target === evt.currentTarget)
      this.close();
  }

  /**
   *Opens the Popup
   */
  open() {
    //closes popup with a click outside form/photo
    this._popup.addEventListener('click', this._handleSideClickClose);

    //closes popup with Escape button press
    window.addEventListener('keydown', this._handleEscClose);

    this._popup.classList.add(config.popupOpenedClass);
  }

  /**
   * Closes the Popup
   */
  close() {
    this._popup.classList.remove(config.popupOpenedClass);
    window.removeEventListener('keydown', this._handleEscClose);
    this._popup.removeEventListener('click', this._handleSideClickClose);
  }

  /**
   * Sets event listener for Popup close button
   */
  setEventListeners() {
    this._closeButton.addEventListener('click', () => this.close());
  }
}
