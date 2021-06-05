import {Card} from './Card.js';
import {initialCards, config} from '../utils/constants.js';
import {openPopup, closePopup} from '../utils/utils.js';
import {FormValidator} from './FormValidator.js';

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
  const popupForm = popup.querySelector('.' + config.form);
  const formSubmitButton = popupForm.querySelector('.' + config.submitButton);
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
   (inputs) => addPlaceCard({name: inputs['placeName'][0].value, link: inputs['placeUrl'][0].value}),
   {placeName: {}, placeUrl: {}}, config, formValidator, true));
}

/**
 * Prepends or appends childElement to parentElement
 * @param {HTMLElement | DocumentFragment} parentElement
 * @param {HTMLElement | DocumentFragment} childElement
 * @param {string} position 'first' == prepend, 'last' == append
 */
function appendElementCustom(parentElement, childElement, position = 'first') {
  if (position === 'first')
    parentElement.prepend(childElement);
  else if (position === 'last')
    parentElement.append(childElement);
}

/**
 * Adds 1 card to destination
 * @param {HTMLElement | DocumentFragment} destination
 * @param {Object} cardData - {name: "", link: ""}
 * @param {string} position - 'first' || 'last'
 */
function addPlaceCardCustom(destination, cardData, position = 'first') {
  cardData.templateSelector = '#placeCardTemplate';
  const placeCard = new Card(cardData);
  appendElementCustom(destination, placeCard.generateCard(), position);
}

/**
 * Prepares addPlaceCard for use
 * @returns {function} addPlaceCard
 */
function makeAddPlaceCard() {
  const placesList = document.querySelector('.places__list');

  /**
  * Adds 1 card to the page
  * @param {Object} cardData - {name: "", link: ""}
  * @param {string} position - 'first' || 'last'
  */
  function addPlaceCard(cardData, position = 'first') {
    addPlaceCardCustom(placesList, cardData, position);
  }
  return addPlaceCard;
}

/**
 * Prepares addPlaceCardMulti for use
 * @returns {function} addPlaceCardMulti
 */
function makeAddPlaceCardMulti() {
  const placesList = document.querySelector('.places__list');

  /**
  * Adds a set of cards to the page from a cards array with single layout recalculation
  * @param {Array} arr - Array of {name: '', link: ''} pairs
  * @param {string} position - 'first' || 'last' - adds the whole fragment in the beginning or the end
  * @param {boolean} reverse - false || true -> reverses array
  */
  function addPlaceCardMulti(arr, position = 'first', reverse = false) {
    //trigger layout recalc only once
    const cardsFragment = new DocumentFragment();
    if (reverse)
      arr = arr.reverse();
    arr.forEach(item => addPlaceCardCustom(cardsFragment, item, 'last'));
    appendElementCustom(placesList, cardsFragment, position);
  }
  return addPlaceCardMulti;
}

/**
 * Prepares a popup for use
 * @param {string} popupId
 * @param {function} processPopupCustom
 */
function initPopup(popupId, processPopupCustom, formValidator = null) {
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

//prepare card creation logic
const addPlaceCard = makeAddPlaceCard();
const addPlaceCardMulti = makeAddPlaceCardMulti();

//display initial cards
addPlaceCardMulti(initialCards);

//prepare popups
initPopup('#editProfile', processProfileEditPopup);
initPopup('#addPlace', processProfileAddPopup);
initPopup('#showPhoto', () => {});
