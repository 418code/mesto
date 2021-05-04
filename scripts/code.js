const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
  }
];

//
/**
 * Switches popup between open and close states
 * @param {HTMLElement} popup
 */
function togglePopup(popup) {
  popup.classList.toggle('popup_opened');
}

/**
 * Handles form logic inside popup
 * @param {HTMLElement} popup
 * @param {function} useFormInput - callback for processing form input
 * @param {function} getValues - callback for getting form values
 * @returns {function} custom open button handler
 */
function processFormPopup(popup, useFormInput, getValues = () => ["",""]) {
  const topInput = popup.querySelectorAll('.popup__form-text')[0];
  const bottomInput = popup.querySelectorAll('.popup__form-text')[1];

  //open button handler callback for form popup
  function presentFormPopup() {
    //fill placeholder values from existing data
    const values = getValues();
    topInput.value = values[0];
    bottomInput.value = values[1];
    togglePopup(popup);
  }

  //form submit button callback
  function submitFormCustom(evt) {
    evt.preventDefault();
    useFormInput(topInput.value, bottomInput.value);
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
 * @returns {function} processFormPopup
 */
function processProfileEditPopup(popup) {
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');

  //useFormInput callback
  function editProfile(profileNameNew, profileDescriptionNew) {
    if (profileName !== "")
      profileName.textContent = profileNameNew;
    if (profileDescription !== "")
      profileDescription.textContent = profileDescriptionNew;
  }

  //callback to prevent static form values
  function getValues() {
    return [profileName.textContent, profileDescription.textContent];
  }

  //send the open button handler back
  return processFormPopup(popup, editProfile, getValues);
}

/**
 * Handles profile add new card logic inside popup
 * @param {HTMLElement} popup
 * @returns processFormPopup
 */
function processProfileAddPopup(popup) {
  return processFormPopup(popup, (cardName, urlLink) => addPlaceCard(cardName, urlLink));
}

/**
 * Prepares photo popup
 * @param {HTMLElement} popup
 * @param {Array} attributes - [{src: 'imageUrl'}, {alt: 'photo text description'}]
 * @param {string} photoDescription
 * @returns {function} photo onclick callback
 */
function processShowPhotoPopup(popup, attributes = [{src: ''}, {alt: ''}], photoDescription = '') {
  const popupPhoto = popup.querySelector('.popup__photo');
  const popupPhotoDescription = popup.querySelector('.popup__photo-description');
  //photo onclick callback
  return () => {
    setElementAttributes(popupPhoto, attributes);
    popupPhotoDescription.textContent = photoDescription;
    togglePopup(popup)
  };
}

/**
 * Prepares a popup for use
 * @param {string} popupId
 * @param {HTMLElement} openButton
 * @param {function} processPopupCustom
 * @returns {HTMLElement} popup
 */
function initPopup(popupId, openButton, processPopupCustom) {
  const popup = document.querySelector(popupId);

  //close the popup with X, only 1 event listener
  const closeButton = popup.querySelector('.popup__container-close-btn');
  if (!closeButton.onclick)
    closeButton.onclick = () => togglePopup(popup);

  //open popup with openButton, only 1 action per button
  if (!openButton.onclick)
    openButton.onclick = processPopupCustom(popup);

  return popup;
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
 * Creates an empty place card from place card template
 * @returns {HTMLElement}
 */
function getCardFromTemplate() {
  const placeCardTemplate = document.querySelector('#placeCardTemplate').content;
  const placeCard = placeCardTemplate.querySelector('.place').cloneNode(true);
  return placeCard;
}

/**
 * Creates a new place card
 * @param {string} placeName - name
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
  const popup = initPopup('#showPhoto', placePhoto, (popup) => processShowPhotoPopup(popup, photoAttributes, `${placeNameText}`));

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
 * Adds 1 card to the page
 * @param {string} cardName
 * @param {string} urlLink
 * @param {string} position - 'first' || 'last'
 */
function addPlaceCard(cardName, urlLink, position = 'first') {
  const placesList = document.querySelector('.places__list');
  addPlaceCardCustom(placesList, cardName, urlLink, position);
}

/**
 * Adds a set of cards to the page from a cards array with single layout recalculation
 * @param {Array} arr - Array of {name: '', link: ''} pairs
 * @param {string} position - 'first' || 'last' - adds the whole fragment in the beginning or the end
 * @param {boolean} reverse - false || true -> reverses array
 */
function addPlaceCardMulti(arr, position = 'first', reverse = false) {
  const placesList = document.querySelector('.places__list');
  //trigger layout recalc only once
  const cardsFragment = new DocumentFragment();
  if (reverse)
    arr = arr.reverse();
  arr.forEach(item => addPlaceCardCustom(cardsFragment, item.name, item.link, 'last'));
  appendElementCustom(placesList, cardsFragment, position);
}

/**
 * Initializes the page on load
 */
function initPage() {
  //display initial cards
  addPlaceCardMulti(initialCards);

  //get the popup open button
  const profileEditButton = document.querySelector('.profile__edit-button');
  const profileEditPopup = initPopup('#editProfile', profileEditButton, processProfileEditPopup);

  //get handler for card add button
  const profileAddButton = document.querySelector('.profile__add-button');
  const profileAddPopup = initPopup('#addPlace', profileAddButton, processProfileAddPopup);
}
