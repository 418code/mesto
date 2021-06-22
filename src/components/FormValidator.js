export default class FormValidator {
  constructor(config, form) {
    this._config = config;
    this._form = form;
    this._submitButton = this._form.querySelector(this._config.popupFormSubmitButtonSelector);
    this._inputs = Array.from(this._form.querySelectorAll(this._config.popupFormInputSelector));
    this._errors = this._inputs.map(input =>  this._form.querySelector(`.${input.id}-error`));
  }

  /**
   * Disables form submit button
   */
  _disableSubmitButton = () => {
    this._submitButton.setAttribute('disabled', 'disabled');
    this._submitButton.classList.remove(...this._config.transparentMuchMore);
    this._submitButton.classList.add(this._config.submitButtonDisabled);
  }

  /**
   * Enables form submit button
   */
  _enableSubmitButton = () => {
    this._submitButton.classList.remove(this._config.submitButtonDisabled);
    this._submitButton.classList.add(...this._config.transparentMuchMore);
    this._submitButton.removeAttribute('disabled');
  }

  /**
   * Shows error for form input field
   * @param {HTMLElement} errorElement
   * @param {HTMLElement} input
   */
  _showError = (errorElement, input) => {
    errorElement.textContent = input.validationMessage;
    input.classList.add(this._config.inputFieldError);
    errorElement.classList.add(this._config.inputErrorMessageActive);
  }

  /**
   * Hides error for form input field
   * @param {HTMLElement} errorElement
   * @param {HTMLElement} input
   */
  _hideError = (errorElement, input) => {
    input.classList.remove(this._config.inputFieldError);
    errorElement.classList.remove(this._config.inputErrorMessageActive);
    errorElement.textContent = "";
  }

  /**
   * Hides all errors for the form
   */
  _hideErrorAll = () => {
    this._inputs.forEach((input, index) => {
      this._hideError(this._errors[index], input);
    });
  }

  /**
   * Checks if input field is valid according to HTML validation criteria
   * @param {HTMLElement} input
   * @param {HTMLElement} errorElement
   */
  _checkInputValidity = (input, errorElement) => {
    if (!input.validity.valid)
      this._showError(errorElement, input);
    else
      this._hideError(errorElement, input);
  }

  /**
   * Checks if all inputs are valid
   */
  _checkInputValidityAll = () => {
    return this._inputs.every(input => input.validity.valid);
  }

  /**
   * Sets form submit button state depending on validity of its input fields
   */
  _setSubmitState = () => {
    if (!this._checkInputValidityAll())
      this._disableSubmitButton();
    else
      this._enableSubmitButton();
  }

  /**
   * Clears the form
   */
  clearForm = () => {
    this._form.reset();
    this._hideErrorAll();
    this._disableSubmitButton();
  }

  /**
   * Enables custom HTML/CSS/JS validation for the form
   */
  enableValidation = () => {
    this._inputs.forEach(input => {
      const errorElement = this._form.querySelector(`.${input.id}-error`);
      input.addEventListener('input', (evt) => {
        this._checkInputValidity(evt.target, errorElement);
        this._setSubmitState();
      });
    });
  }
}
