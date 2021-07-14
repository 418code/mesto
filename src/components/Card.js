import {setElementAttributes} from '../utils/utils.js';
import {config} from '../utils/constants.js';

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
    this._likeCallback = data.cardLikeCallback;
  }

  /**
  * Creates an empty place card from place card template
  * @returns {HTMLElement}
  */
  _getCardFromTemplate = () => {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content
      .querySelector(config.placeCardSelector)
      .cloneNode(true);
    return cardElement;
  };

  /**
   * Deletes the card from the page
   */
  delete = () => {
    this._newPlaceCard.remove();
    this._newPlaceCard = null;
  };

  /**
   * Event listener handler for delete button
   */
  _handleDeleteClick = () => {
    this._cardDeleteCallback(this, this._id);
  };

  /**
   * Event listener handler for like button
   */
  _handleLikeClick = () => {
    this._likeCallback(this, this._id, this._isLiked());
  };

  /**
   * Switches like button between on and off visual state
   */
  toggleLikeButton = () => {
    this._likeButton.classList.toggle(config.placeLikeBtnSelectedClass);
  };

  /**
   * Checks if the card is liked
   * @returns {Boolean}
   */
  _isLiked = () => this._likes.find((likeObj) => likeObj._id === this._userId);

  /**
   * Sets event listeners for card buttons
   */
  _setEventListeners = () => {
    if (this._userId === this._owner._id)
      this._deleteButton.addEventListener('click', this._handleDeleteClick);
    this._likeButton.addEventListener('click', this._handleLikeClick);
    this._placePhoto.addEventListener('click', this._handleCardClick(this._photoAttributes, this._placeNameText));
  };

  /**
   * Sets card's number of likes
   */
  _setNumberOfLikes = () => {
    this._numberOfLikes.textContent = this._likes.length;
  };

  /**
   * Updates card's likes
   * @param {Array} likes
   */
  setLikes = (likes) => {
    this._likes = likes;
    this._setNumberOfLikes();
  };

  /**
   * Creates a complete place card
   * @returns {HTMLElement}
   */
  generateCard = () => {
    this._newPlaceCard = this._getCardFromTemplate();

    this._placePhoto = this._newPlaceCard.querySelector(config.placePhotoSelector);
    setElementAttributes(this._placePhoto, this._photoAttributes);

    this._placeName = this._newPlaceCard.querySelector(config.placeNameSelector);
    this._placeName.textContent = `${this._placeNameText}`;


    this._deleteButton = this._newPlaceCard.querySelector(config.placeDeleteBtnSelector);
    if (this._userId != this._owner._id) {
      this._deleteButton.remove();
      this._deleteButton = null;
    }

    this._likeButton = this._newPlaceCard.querySelector(config.placeLikeBtnSelector);
    this._numberOfLikes = this._newPlaceCard.querySelector(config.placeNumberOfLikesSelector);
    this._setNumberOfLikes();
    if (this._isLiked())
      this.toggleLikeButton();

    this._setEventListeners();

    return this._newPlaceCard;
  }
}
