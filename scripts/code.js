
//opens or closes popup
function togglePopup(popup) {
  popup.classList.toggle('popup_opened');
}

//handles form logic inside popup
function formPopupProcessor(popup, formSubmitAction, getValues) {
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

//handles popup logic
function popupInit(popupId, openButton, customPopupProcessor) {
  const popup = document.querySelector(popupId);

  //close the popup with X
  const closeButton = popup.querySelector('.popup__container-close-btn');
  closeButton.addEventListener('click', () => {togglePopup(popup)});

  //open popup with openButton
  openButton.addEventListener('click', customPopupProcessor(popup));
}

//get the popup open button
const profileEditButton = document.querySelector('.profile__edit-button');
popupInit('#editProfile', profileEditButton, profileEditPopupProcessor);
