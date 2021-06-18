import { setElementAttributes } from '../utils/utils.js';
import { config } from '../utils/constants.js';
import Popup from './Popup.js';

export default class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupPhoto = this._popup.querySelector(config.popupPhotoSelector);
    this._popupPhotoDescription = this._popup.querySelector(config.popupPhotoDescriptionSelector);
    this.setEventListeners();
  }

  /**
   * Opens PopupWithImage
   * @param {Array} attributes - [{src: 'linkToImage'}, {alt: 'text description'}]
   * @param {String} photoDescription
   */
  open(attributes, photoDescription) {
    setElementAttributes(this._popupPhoto, attributes);
    this._popupPhotoDescription.textContent = photoDescription;
    super.open();
  }

  /**
   * Closes PopupWithImage
   */
  close() {
    super.close();
    this._popupPhotoDescription.textContent = '';
    setElementAttributes(this._popupPhoto, [{src: ''}, {alt: ''}]);
  }
}
