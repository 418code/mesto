import {setElementAttributes} from '../utils/utils.js';

export class Card {
  constructor(data) {
    this._placeNameText = data.name;
    this._imageUrl = data.link;
    this._photoAttributes = [{src: this._imageUrl}, {alt: `фото ${this._placeNameText}`}];
    this._templateSelector = data.templateSelector;
    this._handleCardClick = data.handleCardClick;
    this._cardDeleteCallback = data.cardDeleteCallback;
    this._owner = data.owner;
    this._id = data._id;
    this._userId = data.userId;
    this._likes = data.likes;
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
   * Deletes card locally, if api delete call is successful
   * @param {Promise} promise - returned by a call to Api.deleteCard
   */
  _localCardDeleteCallback = (promise) => {
    promise
    .then(res => {
      //remove card on the page if api promise resolved and card is deleted on the server
      this._newPlaceCard.remove();
      this._newPlaceCard = null;
    })
    .catch(err => console.log(err));
  }

  /**
   * Event listener handler for delete button
   */
  _handleDeleteClick = () => {
    //combines confirm popup logic, api delete logic, and local delete logic
    this._cardDeleteCallback(this._id, this._localCardDeleteCallback);
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
    if (this._userId === this._owner._id)
      this._deleteButton.addEventListener('click', this._handleDeleteClick);
    this._likeButton.addEventListener('click', this._handleLikeClick);
    this._placePhoto.addEventListener('click', this._handleCardClick(this._photoAttributes, this._placeNameText));
  }

  /**
   * Sets card's number of likes
   */
  _setNumberOfLikes = () => {
    this._numberOfLikes.textContent = this._likes.length;
  }

  /**
   * Creates a complete place card
   * @returns {HTMLElement}
   */
  generateCard = () => {
    this._newPlaceCard = this._getCardFromTemplate();

    this._placePhoto = this._newPlaceCard.querySelector('.place__photo');
    setElementAttributes(this._placePhoto, this._photoAttributes);

    this._placeName = this._newPlaceCard.querySelector('.place__name');
    this._placeName.textContent = `${this._placeNameText}`;


    this._deleteButton = this._newPlaceCard.querySelector('.place__remove-btn');
    if (this._userId != this._owner._id) {
      this._deleteButton.remove();
      this._deleteButton = null;
    }

    this._likeButton = this._newPlaceCard.querySelector('.place__like-btn');
    this._numberOfLikes = this._newPlaceCard.querySelector('.place__number-of-likes');
    this._setNumberOfLikes();

    this._setEventListeners();

    return this._newPlaceCard;
  }
}
