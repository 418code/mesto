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

//opens or closes popup
function togglePopup(popup) {
  popup.classList.toggle('popup_opened');
}

//handles form logic inside popup
function formPopupProcessor(popup, formSubmitAction, getValues = () => ["",""]) {
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
  function customFormSubmit(evt) {
    evt.preventDefault();
    formSubmitAction(topInput.value, bottomInput.value);
    togglePopup(popup);
  }

  //form save button
  const popupForm = popup.querySelector('.popup__form');
  popupForm.addEventListener('submit', customFormSubmit);

  //send back custom open button handler
  return presentFormPopup;
}

//handles profile edit logic indside popup
function profileEditPopupProcessor(popup) {
  let profileName = document.querySelector('.profile__name');
  let profileDescription = document.querySelector('.profile__description');

  //formSubmitAction callback
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
  return formPopupProcessor(popup, editProfile, getValues);
}

function profileAddPopupProcessor(popup) {
  return formPopupProcessor(popup, (cardName, urlLink) => addPlaceCard(createPlaceCard(cardName, urlLink)));
}

/**
 * Prepares photo popup
 * @param {HTMLElement} popup
 * @param {Array} attributes - [{src: 'imageUrl'}, {alt: 'photo text description'}]
 * @param {string} photoDescription
 * @returns {function} photo onclick callback
 */
function showPhotoPopupProcessor(popup, attributes = [{src: ''}, {alt: ''}], photoDescription = '') {
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
 * @param {function} customPopupProcessor
 * @returns {HTMLElement} popup
 */
function popupInit(popupId, openButton, customPopupProcessor) {
  const popup = document.querySelector(popupId);

  //close the popup with X, only 1 event listener
  const closeButton = popup.querySelector('.popup__container-close-btn');
  if (!closeButton.onclick)
    closeButton.onclick = () => togglePopup(popup);

  //open popup with openButton, only 1 action per button
  if (!openButton.onclick)
    openButton.onclick = customPopupProcessor(popup);

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
 * Creates a new place card
 * @param {string} placeName - name
 * @param {string} imageUrl - url
 * @returns {HTMLElement} HTMLElement place card
 */
 function createPlaceCard(placeNameText, imageUrl) {
  const placeCardTemplate = document.querySelector('#placeCardTemplate').content;
  const newPlaceCard = placeCardTemplate.querySelector('.place').cloneNode(true);

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
  const popup = popupInit('#showPhoto', placePhoto, (popup) => showPhotoPopupProcessor(popup, photoAttributes, `${placeNameText}`));

  return newPlaceCard;
}

/**
 * Prepends or appends childElement to parentElement
 * @param {HTMLElement} parentElement
 * @param {HTMLElement} childElement
 * @param {string} position 'first' == prepend, 'last' == append
 */
function appendElementCustom(parentElement, childElement, position = 'first') {
  if (position === 'first')
    parentElement.prepend(childElement);
  else if (position === 'last')
    parentElement.append(childElement);
}

/**
 * Adds a place card to places list
 * @param {HTMLElement} placeCard
 * @param {string} position - 'first' || 'last'
 */
function addPlaceCard(placeCard, position = 'first') {
  const placesList = document.querySelector('.places__list');
  appendElementCustom(placesList, placeCard, position);
}

/**
 * Adds a set of cards to the page from a cards array
 * @param {Array} arr - Array of {name: '', link: ''} pairs
 * @param {string} position - 'first' || 'last'
 */
function createCardsFromArray(arr, position = 'first') {
  arr.forEach(item => addPlaceCard(createPlaceCard(item.name, item.link), position));
}

/**
 * Initializes the page on load
 */
function pageInit() {
  //display initial cards
  createCardsFromArray(initialCards, 'last');

  //get the popup open button
  const profileEditButton = document.querySelector('.profile__edit-button');
  const profileEditPopup = popupInit('#editProfile', profileEditButton, profileEditPopupProcessor);

  //get handler for card add button
  const profileAddButton = document.querySelector('.profile__add-button');
  const profileAddPopup = popupInit('#addPlace', profileAddButton, profileAddPopupProcessor);
}
