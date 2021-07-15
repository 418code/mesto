import {Card} from '../components/Card.js';
import {config} from '../utils/constants.js';
import Section from '../components/Section.js';
import PopupWithImage from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import FormValidator from '../components/FormValidator.js';
import UserInfo from '../components/UserInfo.js';
import './index.css';
import Api from '../components/Api.js';
import PopupConfirm from '../components/PopupConfirm.js';

/**
 * Event listener handler for card photo
 */
function handleCardClick (popup) {
  return function (photoAttributes, placeNameText) {
           return () => {popup.open(photoAttributes, placeNameText)}
         }
};

/**
 * Creates a callback for card removal
 * @param {Api} api
 * @param {PopupConfirm} deleteConfirmPopup
 * @returns {cardDeleteCallback}
 */
function makeCardDeleteCallback(api, deleteConfirmPopup) {
  /**
   * Deletes a card from the server and from the page
   * @callback cardDeleteCallback
   * @param {Card} card
   * @param {String} cardId
   */
  const cardDeleteCallback = (card, cardId) => {
    deleteConfirmPopup.setSubmitHandler((evt) => {
      evt.preventDefault();
      api.deleteCard(cardId)
      .then(res => {
        card.delete();
        deleteConfirmPopup.close();
      })
      .catch(err => console.log(err))
      .finally(deleteConfirmPopup.setSubmitHandler(null));
    });
    deleteConfirmPopup.open();
  };
  return cardDeleteCallback;
}

/**
 * Creates a callback for like functionality
 * @param {Api} api
 * @returns {cardLikeCallback}
 */
function makeCardLikeCallback(api) {
  /**
   * Likes a card on the server and on the page
   * @callback cardLikeCallback
   * @param {Card} card
   * @param {String} cardId
   * @param {Boolean} liked
   */
  const cardLikeCallback = (card, cardId, liked) => {
    const apiCallResult = liked ? api.unlikeCard(cardId) : api.likeCard(cardId);
    apiCallResult
    .then(res => {
      card.toggleLikeButton();
      card.setLikes(res.likes);
    })
    .catch(err => console.log(err));
  };
  return cardLikeCallback;
}

/**
 * Adds a place card to the page
 * @param {Object} cardData - {name: "", link: "", ...}
 * @param {Section} destinationSection
 */
function addPlaceCard(cardData, destinationSection, api, userInfo, deleteConfirmPopup) {
  cardData.templateSelector = config.cardTemplateSelector;
  cardData.handleCardClick = handleCardClick(photoPopup);
  cardData.cardDeleteCallback = makeCardDeleteCallback(api, deleteConfirmPopup);
  cardData.cardLikeCallback = makeCardLikeCallback(api);
  cardData.userId = userInfo.getUserInfo().userId;
  const placeCard = new Card(cardData);
  destinationSection.addItem(placeCard.generateCard());
}

const photoPopup = new PopupWithImage(config.photoPopupTemplateSelector);

/**
 * Creates a form submit handler with a given callback
 * @param {Function} callback - runs inside of the handler
 * @returns {formSubmitHandler}
 */
function makeFormSubmitHandler(callback) {
  /**
   * Creates a form submit handler with the given popup and form data
   * @callback formSubmitHandler
   * @param {PopupWithForm} popup
   * @param {Object} formData - {property1: "value1", property2: "value2"}
   * @returns
   */
  const handler = function formSubmitHandler (popup, formData) {
    return function (evt) {
      evt.preventDefault();
      callback(popup, formData);
    }
  }
  return handler;
}

/**
 * Creates a form submit callback for use in makeFormSubmitHandler
 * @param {Function} apiCallback - (formData) => api.method(...) - returns a promise
 * @param {Function} thenCallback - (formData, result) => {...} - returns nothing
 * @returns {formSubmitCallback} form submit callback
 */
function makeFormSubmitCallback(apiCallback, thenCallback) {
  /**
   * Is called on form submit in a popup
   * @callback formSubmitCallback
   * @param {PopupWithForm} popup
   * @param {Object} formData - {property1: "value1", property2: "value2"}
   */
  const formSubmitCallback = (popup, formData) => {
    popup.setSubmitButtonSavingText(true);
    apiCallback(formData)
    .then(result => {
      thenCallback(formData, result);
      popup.close();
    })
    .catch(err => console.log(err))
    .finally(() => {popup.setSubmitButtonSavingText(false)});
  }
  return formSubmitCallback;
}

/**
 * Creates enabled form validator for a given form
 * @param {HTMLElement} form
 * @returns {FormValidator}
 */
function makeEnabledValidator(form) {
  const validator = new FormValidator(config, form);
  validator.enableValidation();
  return validator;
}

//prepare api object for use
const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-25/',
  headers: {
    authorization: 'd8d84bac-32d7-42f9-a622-bbe14f1aa9f5',
    'Content-Type': 'application/json'
  }
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([info, cards]) => {

    //set up profile info logic
    info.profileNameSelector = config.profileNameSelector;
    info.profileDescriptionSelector = config.profileDescriptionSelector;
    info.profileAvatarSelector = config.profileAvatarSelector;
    const profileInfo = new UserInfo(info);

    profileInfo.setUserInfo({ name: info.name, description: info.about });

    const profileEditSubmitHandler = makeFormSubmitHandler(
        makeFormSubmitCallback(
          (formData) => api.setUserInfo({ name: formData[config.profileInputNameName], about: formData[config.profileInputDescriptionName] }),
          (formData, result) => {profileInfo.setUserInfo({ name: formData[config.profileInputNameName], description: formData[config.profileInputDescriptionName] })}
        )
    );

    const profileEditPopup = new PopupWithForm({
      popupSelector: config.profileEditPopupTemplateSelector,
      formSubmitCallback: profileEditSubmitHandler });

    const profileEditPopupValidator = makeEnabledValidator(profileEditPopup.getForm());
    const profileEditButton = document.querySelector('.profile__edit-button');
    profileEditButton.addEventListener('click',
      () => profileEditPopup.open(
        () => {
          profileEditPopupValidator.clearFormValidation();
          profileEditPopup.setInputValues(profileInfo.getUserInfo());
        }
      )
    );

    //prep avatar edit logic
    const avatarEditSubmitHandler = makeFormSubmitHandler(
      makeFormSubmitCallback(
        (formData) => api.setUserAvatar(formData[config.avatarEditInputName]),
        (formData, result) => {profileInfo.setUserAvatar(formData[config.avatarEditInputName])}
      )
    );

    const avatarEditPopup = new PopupWithForm({
      popupSelector: config.avatarEditPopupTemplateSelector,
      formSubmitCallback: avatarEditSubmitHandler
    });

    const avatarEditPopupValidator = makeEnabledValidator(avatarEditPopup.getForm());
    const avatarEditButton = document.querySelector(config.profileAvatarEditButtonSelector);
    avatarEditButton.addEventListener('click',
      () => avatarEditPopup.open( () => avatarEditPopupValidator.clearFormValidation() )
    );

    //prepare card delete popup
    const cardDeleteConfirmPopup = new PopupConfirm(config.cardDeleteConfirmPopupTemplateSelector);

    //display initial cards
    const placesList = new Section({
      items: cards.reverse(),
      renderer: (item) => addPlaceCard(item, placesList, api, profileInfo, cardDeleteConfirmPopup)
    }, `.${config.placesList}`);

    placesList.renderItems();

    //set up card addition logic
    const profileAddSubmitHandler = makeFormSubmitHandler(
      makeFormSubmitCallback(
        (formData) => api.addCard({ name: formData[config.placeInputNameName],
                                    link: formData[config.placeInputUrlName] }),
        (formData, result) => {addPlaceCard(result, placesList, api, profileInfo, cardDeleteConfirmPopup)}
      )
    );

    const profileAddPopup = new PopupWithForm({
      popupSelector: config.profileAddPopupTemplateSelector,
      formSubmitCallback: profileAddSubmitHandler });

    const profileAddPopupValidator = makeEnabledValidator(profileAddPopup.getForm());

    const profileAddButton = document.querySelector(config.profileAddButtonSelector);
    profileAddButton.addEventListener('click',
     () => profileAddPopup.open(
       () => profileAddPopupValidator.clearFormValidation()
      )
    );

  })
  .catch(err => console.log(err));



