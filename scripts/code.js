
const popupInputName = document.querySelectorAll('.popup__container-text')[0];
const popupInputDescription = document.querySelectorAll('.popup__container-text')[1];
let profileName = document.querySelector('.profile__name');
let profileDescription = document.querySelector('.profile__description');
let popup = document.querySelector('.popup');

//open profile edit popup
const editButton = document.querySelector('.profile__edit-button');
editButton.addEventListener('click', function() {
  //fill placeholder values from existing data
  popupInputName.value = "";
  popupInputName.placeholder = profileName.textContent;
  popupInputDescription.value = "";
  popupInputDescription.placeholder = profileDescription.textContent;
  popup.classList.add('popup_opened');
});

//close the popup with X
const closeButton = document.querySelector('.popup__container-close-btn');
closeButton.addEventListener('click', function() {
  popup.classList.remove('popup_opened');
});

//popup save button
const popupForm = document.querySelector('.popup__container');
popupForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  if (popupInputName.value !== "")
    profileName.textContent = popupInputName.value;
  if (popupInputDescription.value !== "")
    profileDescription.textContent = popupInputDescription.value;
  popup.classList.remove('popup_opened');
});
