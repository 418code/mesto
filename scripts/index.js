import {Card} from './Card.js';
import {initialCards, config} from '../utils/constants.js';
import {FormValidator} from './FormValidator.js';
import Section from './Section.js';
import PopupWithImage from './PopupWithImage.js';

/**
 * Gets input values from destination
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
 */
function getInputValues(inputs) {
  for (const elements of Object.values(inputs)) {
    const [inputElement, destinationElement] = elements;
    if (inputElement && destinationElement)
    {
      inputElement.value = destinationElement.textContent;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}

/**
 * Applies input values to desination
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
 */
function applyInputValues(inputs) {
  for (const elements of Object.values(inputs)) {
    const [inputElement, destinationElement] = elements;
    if (inputElement && destinationElement)
      destinationElement.textContent = inputElement.value;
  }
}

/**
 * Handles form logic inside popup
 * @param {HTMLElement} popup
 * @param {function} useFormInput - callback with inputs param: {inputName1: [inputElement1, destinationElement1],
 *  inputName2: [inputElement2, destinationElement2]}
 * @param {Object} formInputNamesDestinationElements - {formInputName1: destinationElement1, formInputName2: destinationElement2}
 * @param {boolean} empty - clears form inputs on open if true
 * @returns {function} custom open button handler
 */
function processFormPopup(popup, useFormInput, formInputNamesDestinationElements, config, formValidator, empty = false) {
  //{inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
  const popupForm = popup.querySelector(`.${config.form}`);
  const formSubmitButton = popupForm.querySelector(`.${config.submitButton}`);
  const inputs = {};

  for (const key of Object.keys(formInputNamesDestinationElements)) {
    const inputElement = popup.querySelector(`input[name=${key}]`);
    inputs[key] = [inputElement, formInputNamesDestinationElements[key]];
  }

  //open button handler callback for form popup
  function presentFormPopup() {
    //read input values from destination
    if (!empty)
      getInputValues(inputs);
    else
      formValidator.clearForm();
    openPopup(popup);
  }

  //form submit button callback
  function submitFormCustom(evt) {
    evt.preventDefault();
    useFormInput(inputs);
    closePopup(popup);
  }

  //form save button
  popupForm.addEventListener('submit', submitFormCustom);

  //send back custom open button handler
  return presentFormPopup;
}

/**
 * Handles profile edit logic indside popup
 * @param {HTMLElement} popup
 */
function processProfileEditPopup(popup, formValidator) {
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');
  const profileEditButton = document.querySelector('.profile__edit-button');

  profileEditButton.addEventListener('click', processFormPopup(popup,
   (inputs) => applyInputValues(inputs), {profileName: profileName, profileDescription: profileDescription}, config, formValidator));
}

/**
 * Handles profile add new card logic inside popup
 * @param {HTMLElement} popup
 */
function processProfileAddPopup(popup, formValidator) {
  const profileAddButton = document.querySelector('.profile__add-button');

  profileAddButton.addEventListener('click',
   processFormPopup(popup,
   (inputs) => addPlaceCard({name: inputs['placeName'][0].value, link: inputs['placeUrl'][0].value}, placesList),
   {placeName: {}, placeUrl: {}}, config, formValidator, true));
}

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

/**
 * Prepares a popup for use
 * @param {string} popupId
 * @param {function} processPopupCustom
 */
function initPopup(popupId, processPopupCustom) {
  const popup = document.querySelector(popupId);
  const closeButton = popup.querySelector('.popup__container-close-btn');
  const form = popup.querySelector('.popup__form');

  closeButton.addEventListener('click', () => closePopup(popup));
  if (!form)
    processPopupCustom(popup);
  else {
    const formValidator = new FormValidator(config, form);
    formValidator.enableValidation();
    processPopupCustom(popup, formValidator);
  }
}

const photoPopup = new PopupWithImage(config.photoPopupTemplateSelector);

//display initial cards
const placesList = new Section({
  items: initialCards,
  renderer: (item) => addPlaceCard(item, placesList)
}, `.${config.placesList}`);

placesList.renderItems();

//prepare popups
// initPopup('#editProfile', processProfileEditPopup);
// initPopup('#addPlace', processProfileAddPopup);

