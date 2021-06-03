import {setElementAttributes, makeProcessShowPhotoPopup} from '../utils/utils.js';

export class Card {
  constructor(placeNameText, imageUrl, templateSelector) {
    this._placeNameText = placeNameText;
    this._imageUrl = imageUrl;
    this._templateSelector = templateSelector;
    this._processShowPhotoPopup = makeProcessShowPhotoPopup();
  }

  /**
  * Creates an empty place card from place card template
  * @returns {HTMLElement}
  */
  _getCardFromTemplate = () => {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content
      .querySelector('.place')
      .cloneNode(true);
    return cardElement;
  }

  /**
   * Sets event listeners for card buttons
   */
  _setEventListeners = () => {
    this._deleteButton.addEventListener('click', (evt) => evt.target.parentElement.remove());
    this._likeButton.addEventListener('click', (evt) => evt.target.classList.toggle('place__like-btn_selected'));
  }

  /**
   * Creates a complete place card
   * @returns {HTMLElement}
   */
  generateCard = () => {
    this._newPlaceCard = this._getCardFromTemplate();

    this._placePhoto = this._newPlaceCard.querySelector('.place__photo');
    this._photoAttributes = [{src: this._imageUrl}, {alt: `фото ${this._placeNameText}`}];
    setElementAttributes(this._placePhoto, this._photoAttributes);

    this._placeName = this._newPlaceCard.querySelector('.place__name');
    this._placeName.textContent = `${this._placeNameText}`;

    this._deleteButton = this._newPlaceCard.querySelector('.place__remove-btn');
    this._likeButton = this._newPlaceCard.querySelector('.place__like-btn');

    this._setEventListeners();

    //popup open button -> placePhoto
    this._processShowPhotoPopup(this._placePhoto, this._photoAttributes, `${this._placeNameText}`);

    return this._newPlaceCard;
  }
}
