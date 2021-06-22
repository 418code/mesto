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

const config = {
  popupFormSelector: '.popup__form',
  popupFormInputSelector: '.popup__form-text',
  popupFormSubmitButtonSelector: '.popup__form-submit-btn',
  submitButtonDisabled: 'popup__form-submit-btn_disabled',
  transparentMuchMore: ['transparent', 'transparent_amount_much-more'],
  inputFieldError: 'popup__form-text_type_error',
  inputErrorMessageActive: 'popup__form-text-error_active',
  placesList: 'places__list',
  cardTemplateSelector: '#placeCardTemplate',
  popupCloseButtonSelector: '.popup__container-close-btn',
  popupOpenedClass: 'popup_opened',
  popupPhotoSelector: '.popup__photo',
  popupPhotoDescriptionSelector: '.popup__photo-description',
  photoPopupTemplateSelector: '#showPhoto',
  profileEditPopupTemplateSelector: '#editProfile',
  profileAddPopupTemplateSelector: '#addPlace',
  profileAddButtonSelector: '.profile__add-button',
  profileInputNameName: 'profileName',
  profileInputDescriptionName: 'profileDescription',
  placeInputNameName: 'placeName',
  placeInputUrlName: 'placeUrl',
  profileNameSelector: '.profile__name',
  profileDescriptionSelector: '.profile__description',
};

export {initialCards, config}
