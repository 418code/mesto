/**
 * Switches popup between open and close states
 * @param {HTMLElement} popup
 */
function togglePopup(popup) {
  popup.classList.toggle('popup_opened');
}

/**
 * Gets input values from destination
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
 */
function getInputValues(inputs) {
  for (const pair of Object.values(inputs)) {
    const [inputElement, destinationElement] = pair;
    if (inputElement && destinationElement)
      inputElement.value = destinationElement.textContent;
  }
}

/**
 * Applies input values to desination
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
 */
function applyInputValues(inputs) {
  for (const pair of Object.values(inputs)) {
    const [inputElement, destinationElement] = pair;
    if (inputElement && destinationElement)
      destinationElement.textContent = inputElement.value;
  }
}

/**
 * Clears input values
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
 */
function emptyInputValues(inputs) {
  for (const pair of Object.values(inputs)) {
    const [inputElement, destinationElement] = pair;
    if (inputElement)
      inputElement.value = '';
  }
}

/**
 * Handles form logic inside popup
 * @param {HTMLElement} popup
 * @param {function} useFormInput - callback with inputs param: {inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
 * @param {Object} formInputNamesDestinationElements - {formInputName1: destinationElement1, formInputName2: destinationElement2}
 * @param {boolean} empty - clears form inputs on open if true
 * @returns {function} custom open button handler
 */
function processFormPopup(popup, useFormInput, formInputNamesDestinationElements, empty = false) {
  //{inputName1: [inputElement1, destinationElement1], inputName2: [inputElement2, destinationElement2]}
  const inputs = {};
  for (const key of Object.keys(formInputNamesDestinationElements)) {
    inputs[key] = [popup.querySelector(`input[name=${key}]`), formInputNamesDestinationElements[key]];
  }

  //open button handler callback for form popup
  function presentFormPopup() {
    //read input values from destination
    if (!empty)
      getInputValues(inputs);
    else
      emptyInputValues(inputs);
    togglePopup(popup);
  }

  //form submit button callback
  function submitFormCustom(evt) {
    evt.preventDefault();
    useFormInput(inputs);
    togglePopup(popup);
  }

  //form save button
  const popupForm = popup.querySelector('.popup__form');
  popupForm.addEventListener('submit', submitFormCustom);

  //send back custom open button handler
  return presentFormPopup;
}

/**
 * Handles profile edit logic indside popup
 * @param {HTMLElement} popup
 */
function processProfileEditPopup(popup) {
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');
  const profileEditButton = document.querySelector('.profile__edit-button');

  profileEditButton.addEventListener('click', processFormPopup(popup,
   (inputs) => applyInputValues(inputs), {profileName: profileName, profileDescription: profileDescription}));
}

/**
 * Handles profile add new card logic inside popup
 * @param {HTMLElement} popup
 */
function processProfileAddPopup(popup) {
  const profileAddButton = document.querySelector('.profile__add-button');

  profileAddButton.addEventListener('click',
   processFormPopup(popup,
   (inputs) => addPlaceCard(inputs['placeName'][0].value, inputs['placeUrl'][0].value),
   {placeName: {}, placeUrl: {}}, empty = true));
}

/**
 * Prepares processShowPhotoPopup for use
 * @returns {function} processShowPhotoPopup
 */
function makeProcessShowPhotoPopup() {
  //find it once
  const popup = document.querySelector('#showPhoto');
  const popupPhoto = popup.querySelector('.popup__photo');
  const popupPhotoDescription = popup.querySelector('.popup__photo-description');

  /**
  * Prepares a photo popup
  * @param placePhoto {HTMLElement} - place card photo used as an open button
  * @param {Array} attributes - [{src: 'imageUrl'}, {alt: 'photo text description'}]
  * @param {string} photoDescription - text at the bottom of the popup
  * @returns {function} photo onclick callback
  */
  function processShowPhotoPopup(placePhoto, attributes = [{src: ''}, {alt: ''}], photoDescription = '') {
    placePhoto.addEventListener('click', () => {
      setElementAttributes(popupPhoto, attributes);
      popupPhotoDescription.textContent = photoDescription;
      togglePopup(popup);
    });
  }
  return processShowPhotoPopup;
}

/**
 * Applies attributes to an element from an array of attribute objects
 * @param {HTMLElement} element
 * @param {Array} attributes - [{attr1: 'value1}, {attr2: 'value2'}]
 */
 function setElementAttributes(element, attributes) {
  if (attributes.length > 0) {
    attributes.forEach(attr => {
      const key = Object.keys(attr)[0];
      const value = attr[key];
      element.setAttribute(key, value);
    });
  }
}

/**
 * Prepares getCardFromTemplate for use
 * @returns {function} getCardFromTemplate
 */
function makeGetCardFromTemplate() {
  const placeCardTemplate = document.querySelector('#placeCardTemplate').content;
  const placeCardInsideTemplate = placeCardTemplate.querySelector('.place');
  /**
  * Creates an empty place card from place card template
  * @returns {HTMLElement}
  */
  function getCardFromTemplate() {
    return placeCardInsideTemplate.cloneNode(true);
  }
  return getCardFromTemplate;
}

/**
 * Creates a new place card
 * @param {string} placeNameText - name
 * @param {string} imageUrl - url
 * @returns {HTMLElement} HTMLElement place card
 */
 function createPlaceCard(placeNameText, imageUrl) {
  const newPlaceCard = getCardFromTemplate();

  const placePhoto = newPlaceCard.querySelector('.place__photo');
  const photoAttributes = [{src: imageUrl}, {alt: `фото ${placeNameText}`}];
  setElementAttributes(placePhoto, photoAttributes);

  const placeName = newPlaceCard.querySelector('.place__name');
  placeName.textContent = `${placeNameText}`;

  const deleteButton = newPlaceCard.querySelector('.place__remove-btn');
  const likeButton = newPlaceCard.querySelector('.place__like-btn');

  deleteButton.addEventListener('click', (evt) => evt.target.parentElement.remove());
  likeButton.addEventListener('click', (evt) => evt.target.classList.toggle('place__like-btn_selected'));

  //popup open button -> placePhoto
  processShowPhotoPopup(placePhoto, photoAttributes, `${placeNameText}`);

  return newPlaceCard;
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
 * @param {string} cardName
 * @param {string} urlLink
 * @param {string} position - 'first' || 'last'
 */
function addPlaceCardCustom(destination, cardName, urlLink, position = 'first') {
  appendElementCustom(destination, createPlaceCard(cardName, urlLink), position);
}

/**
 * Prepares addPlaceCard for use
 * @returns {function} addPlaceCard
 */
function makeAddPlaceCard() {
  const placesList = document.querySelector('.places__list');

  /**
  * Adds 1 card to the page
  * @param {string} cardName
  * @param {string} urlLink
  * @param {string} position - 'first' || 'last'
  */
  function addPlaceCard(cardName, urlLink, position = 'first') {
    addPlaceCardCustom(placesList, cardName, urlLink, position);
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
    arr.forEach(item => addPlaceCardCustom(cardsFragment, item.name, item.link, 'last'));
    appendElementCustom(placesList, cardsFragment, position);
  }
  return addPlaceCardMulti;
}

/**
 * Prepares a popup for use
 * @param {string} popupId
 * @param {function} processPopupCustom
 */
function initPopup(popupId, processPopupCustom) {
  const popup = document.querySelector(popupId);
  const closeButton = popup.querySelector('.popup__container-close-btn');

  closeButton.addEventListener('click', () => togglePopup(popup));
  processPopupCustom(popup);
}

//prepare card creation logic
const processShowPhotoPopup = makeProcessShowPhotoPopup();
const getCardFromTemplate = makeGetCardFromTemplate();
const addPlaceCard = makeAddPlaceCard();
const addPlaceCardMulti = makeAddPlaceCardMulti();

//display initial cards
addPlaceCardMulti(initialCards);

//prepare popups
initPopup('#editProfile', processProfileEditPopup);
initPopup('#addPlace', processProfileAddPopup);
initPopup('#showPhoto', () => {});
