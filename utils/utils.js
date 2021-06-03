/**
 * Closes a popup
 * @param {HTMLElement} popup
 */
 function closePopup(popup) {
  popup.classList.remove('popup_opened');
  window.removeEventListener('keydown', handlePopupEscapeClose);
  popup.removeEventListener('click', handlePopupSideClickClose);
}

/**
 * Callback for handling closing popup on Escape button press
 * @param {Object} evt
 */
function handlePopupEscapeClose(evt) {
  if (evt.key === "Escape")
    closePopup(handlePopupEscapeClose.popup);
}

/**
 * Callback for handling closing popup with a side click
 * @param {Object} evt
 */
function handlePopupSideClickClose(evt) {
  if (evt.target === evt.currentTarget)
    closePopup(handlePopupSideClickClose.popup);
}

/**
 * Opens a popup
 * @param {HTMLElement} popup
 */
function openPopup(popup) {
  //closes popup with a click outside form/photo
  handlePopupSideClickClose.popup = popup;
  popup.addEventListener('click', handlePopupSideClickClose);

  //closes popup with Escape button press
  handlePopupEscapeClose.popup = popup;
  window.addEventListener('keydown', handlePopupEscapeClose);

  popup.classList.add('popup_opened');
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
      openPopup(popup);
    });
  }
  return processShowPhotoPopup;
}

export {closePopup, openPopup, setElementAttributes, makeProcessShowPhotoPopup}
