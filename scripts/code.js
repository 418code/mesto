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
  return formPopupProcessor(popup, createPlaceCard);
}

//handles popup logic
function popupInit(popupId, openButton, customPopupProcessor) {
  const popup = document.querySelector(popupId);

  //close the popup with X
  const closeButton = popup.querySelector('.popup__container-close-btn');
  closeButton.addEventListener('click', () => {togglePopup(popup)});

  //open popup with openButton
  openButton.addEventListener('click', customPopupProcessor(popup));
}

/**
 * Creates a new place card
 * @param {string} placeName - name
 * @param {string} imageUrl - url
 * @param {string} position - first || last
 */
 function createPlaceCard(placeName, imageUrl, position = 'first') {
  //check if fields aren't empty
  if (placeName && imageUrl && (position === 'first' || position === 'last')) {
    let placesList = document.querySelector('.places__list');
    let newPlaceCard = document.createElement('li');
    newPlaceCard.classList.add('place');
    newPlaceCard.innerHTML = `<button class="place__remove-btn transparent transparent_amount_more" type="button"></button>
    <img src="${imageUrl}" alt="изображение ${placeName}" class="place__photo">
    <div class="place__name-like-container">
      <h2 class="place__name">${placeName}</h2>
      <button class="place__like transparent transparent_amount_less" type="button"></button>
    </div>`

    const deleteButton = newPlaceCard.querySelector('.place__remove-btn');
    deleteButton.addEventListener('click', () => newPlaceCard.remove());

    if (position === 'first')
      placesList.prepend(newPlaceCard);
    else if (position === 'last')
      placesList.append(newPlaceCard);
  }
}

/**
 * Generates set of cards from an array
 * @param {Array} arr - Array of {name: '', link: ''} pairs
 * @param {string} position - 'first' || 'last'
 */
function createCardsFromArray(arr, position = 'first') {
  arr.forEach(item => createPlaceCard(item.name, item.link, position));
}

/**
 * Initializes the page on load
 */
function pageInit() {
  //display initial cards
  createCardsFromArray(initialCards, 'last');

  //get the popup open button
  const profileEditButton = document.querySelector('.profile__edit-button');
  popupInit('#editProfile', profileEditButton, profileEditPopupProcessor);

  //get handler for card add button
  const profileAddButton = document.querySelector('.profile__add-button');
  popupInit('#addPlace', profileAddButton, profileAddPopupProcessor);
}
