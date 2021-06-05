import {setElementAttributes, makeProcessShowPhotoPopup} from '../utils/utils.js';

export class Card {
  constructor(data) {
    this._placeNameText = data.name;
    this._imageUrl = data.link;
    this._templateSelector = data.templateSelector;
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
   * Event listener handler for delete button
   */
  _handleDeleteClick = () => {
    this._newPlaceCard.remove();
    this._newPlaceCard = null;
  }

  /**
   * Event listener handler for like button
   */
  _handleLikeClick = () => {
    this._likeButton.classList.toggle('place__like-btn_selected');
  }

  /**
   * Sets event listeners for card buttons
   */
  _setEventListeners = () => {
    this._deleteButton.addEventListener('click', this._handleDeleteClick);
    this._likeButton.addEventListener('click', this._handleLikeClick);
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
