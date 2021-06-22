import {Card} from '../components/Card.js';
import {initialCards, config} from '../utils/constants.js';
import Section from '../components/Section.js';
import PopupWithImage from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import './index.css';

/**
 * Event listener handler for card photo
 */
function handleCardClick (popup) {
  return function (photoAttributes, placeNameText) {
           return () => {popup.open(photoAttributes, placeNameText)}
         }
};

/**
 * Adds a new place card to a section
 * @param {Object} cardData - {name: "", link: ""}
 * @param {Section} destinationSection
 */
function addPlaceCard(cardData, destinationSection) {
  cardData.templateSelector = config.cardTemplateSelector;
  cardData.handleCardClick = handleCardClick(photoPopup);
  const placeCard = new Card(cardData);
  destinationSection.addItem(placeCard.generateCard());
}

const photoPopup = new PopupWithImage(config.photoPopupTemplateSelector);

//display initial cards
const placesList = new Section({
  items: initialCards,
  renderer: (item) => addPlaceCard(item, placesList)
}, `.${config.placesList}`);

placesList.renderItems();

/**
 * Creates a form submit handler with a given callback
 * @param {Function} callback - runs inside of the handler
 * @returns {formSubmitHandler}
 */
function makeFormSubmitHandler(callback) {
  /**
   * Creates a form submit handler with the given form data
   * @param {Object} formData - {property1: "value1", property2: "value2"}
   * @returns
   */
  const handler = function formSubmitHandler (formData) {
    return function (evt) {
      evt.preventDefault();
      callback(formData);
      this.close();
    }
  }
  return handler;
}

const profileAddSubmitHandler = makeFormSubmitHandler(
  (formData) => addPlaceCard({ name: formData[config.placeInputNameName], link: formData[config.placeInputUrlName] }, placesList)
);

const profileAddPopup = new PopupWithForm(config.profileAddPopupTemplateSelector, profileAddSubmitHandler);
const profileAddButton = document.querySelector(config.profileAddButtonSelector);
profileAddButton.addEventListener('click', () => profileAddPopup.open(() => {}));

//set up profile info logic
const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');
const profileInfo = new UserInfo(profileName, profileDescription);


const profileEditSubmitHandler = makeFormSubmitHandler(
  (formData) => profileInfo.setUserInfo({ name: formData[config.profileInputNameName], description: formData[config.profileInputDescriptionName] })
);

const profileEditPopup = new PopupWithForm(config.profileEditPopupTemplateSelector, profileEditSubmitHandler);
const profileEditButton = document.querySelector('.profile__edit-button');
profileEditButton.addEventListener('click', () => profileEditPopup.open(() => profileEditPopup.setInputValues(profileInfo.getUserInfo())));
