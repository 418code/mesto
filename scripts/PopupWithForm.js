import Popup from './Popup.js';
import FormValidator from './FormValidator.js';
import {config} from '../utils/constants.js';

export default class PopupWithForm extends Popup {
  constructor(popupSelector, formSubmitCallback) {
    super(popupSelector);
    this._popupForm = this._popup.querySelector(config.popupFormSelector);
    this._formSubmitButton = this._popupForm.querySelector(config.popupFormSubmitButtonSelector);

    this._inputList = this._popupForm.querySelectorAll(config.popupFormInputSelector);
    this._formValues = {};
    this._formSubmitCallback = formSubmitCallback(this._formValues).bind(this);


    this._formValidator = new FormValidator(config, this._popupForm);
    this._formValidator.enableValidation();
    this.setEventListeners();
  }

  /**
   * Gathers the data from all form fields
   */
  _getInputValues() {
    this._inputList.forEach(input => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  /**
   * Sets input values for the form
   * @param {Object} values - {property1: "value1", property2: "value2"}
   */
  setInputValues(values) {
    this._inputList.forEach(input => {
      input.value = values[input.name];
    });
  }

  /**
   * Sets event listeners for the popup
   */
  setEventListeners() {
    super.setEventListeners();
    this._formSubmitButton.addEventListener('click', () => this._getInputValues());
    this._popupForm.addEventListener('submit', this._formSubmitCallback);
  }

  /**
   * Closes the popup
   */
  close() {
    super.close();
    this._formValidator.clearForm();
  }

  /**
   * Opens a popup with a custom action
   * @param {Function} customOpenCallback
   */
  open(customOpenCallback) {
    customOpenCallback();
    super.open();
  }
}
