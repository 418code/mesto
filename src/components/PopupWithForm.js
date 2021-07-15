import Popup from './Popup.js';
import {config} from '../utils/constants.js';

export default class PopupWithForm extends Popup {
  constructor({ popupSelector, formSubmitCallback}) {
    super(popupSelector);
    this._popupForm = this._popup.querySelector(config.popupFormSelector);
    this._inputList = this._popupForm.querySelectorAll(config.popupFormInputSelector);
    this._formValues = {};
    this._formSubmitCallback = formSubmitCallback(this, this._formValues).bind(this);
    this._submitButton = this._popup.querySelector(config.popupFormSubmitButtonSelector);
    this._submitButtonOriginalText = this._submitButton.textContent;
    this.setEventListeners();
  }

  /**
   * Gathers the data from all form fields
   */
  _getInputValues() {
    this._inputList.forEach(input => this._formValues[input.name] = input.value);
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
    this._popupForm.addEventListener('submit', (evt) => {
      this._getInputValues();
      this._formSubmitCallback(evt)});
  }

  /**
   * Closes the popup
   */
  close() {
    super.close();
    this._popupForm.reset();
  }

  /**
   * Opens a popup with a custom action
   * @param {Function} customOpenCallback
   */
  open(customOpenCallback) {
    customOpenCallback();
    super.open();
  }

  /**
   * Gets popup form
   * @returns {HTMLElement}
   */
   getForm() {
    return this._popupForm;
  }

  /**
   * Switches form submit button text between original and saving
   * @param {Boolean} saving
   */
  setSubmitButtonSavingText(saving) {
    this._submitButton.textContent = saving ? config.popupWithFormSavingText : this._submitButtonOriginalText;
  }
}
