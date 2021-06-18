import {Card} from './Card.js';
import {initialCards, config} from '../utils/constants.js';
import Section from './Section.js';
import PopupWithImage from './PopupWithImage.js';
import PopupWithForm from './PopupWithForm.js';

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

function profileAddSubmitHandler(formData) {
  return function (evt) {
    evt.preventDefault();
    addPlaceCard({ name: formData[config.placeInputNameName], link: formData[config.placeInputUrlName] }, placesList);
    this.close();
  }
}

const profileAddPopup = new PopupWithForm(config.profileAddPopupTemplateSelector, profileAddSubmitHandler);
const profileAddButton = document.querySelector(config.profileAddButtonSelector);
profileAddButton.addEventListener('click', () => profileAddPopup.open());


