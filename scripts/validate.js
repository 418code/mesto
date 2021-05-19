/**
 * Disables form submit button
 * @param {HTMLElement} submitButton
 * @param {Object} config
 */
function disableSubmitButton(submitButton, config) {
  submitButton.setAttribute('disabled', 'disabled');
  submitButton.classList.remove(...config.transparentMuchMore);
  submitButton.classList.add(config.submitButtonDisabled);
}

/**
 * Enables form submit button
 * @param {HTMLElement} submitButton
 * @param {Object} config
 */
function enableSubmitButton(submitButton, config) {
  submitButton.classList.remove(config.submitButtonDisabled);
  submitButton.classList.add(...config.transparentMuchMore);
  submitButton.removeAttribute('disabled');
}

/**
 * Shows error for form input field
 * @param {HTMLElement} errorElement
 * @param {HTMLElement} input
 * @param {Object} config
 */
function showError(errorElement, input, config) {
  errorElement.textContent = input.validationMessage;
  input.classList.add(config.inputFieldError);
  errorElement.classList.add(config.inputErrorMessageActive);
}

/**
 * Hides error for form input field
 * @param {HTMLElement} errorElement
 * @param {HTMLElement} input
 * @param {Object} config
 */
function hideError(errorElement, input, config) {
  input.classList.remove(config.inputFieldError);
  errorElement.classList.remove(config.inputErrorMessageActive);
  errorElement.textContent = "";
}

/**
 * Hides all errors for given input fields
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1, errorElement1], inputName2: [inputElement2, destinationElement2, errorElement2]}
 * @param {Object} config
 */
function hideErrorAll(inputs, config) {
  for (const elements of Object.values(inputs)) {
    const [inputElement,,errorElement] = elements;
    hideError(errorElement, inputElement, config);
  }
}

/**
 * Clears form
 * @param {HTMLElement} form
 * @param {HTMLElement} formSubmitButton
 * @param {Object} inputs - {inputName1: [inputElement1, destinationElement1, errorElement1], inputName2: [inputElement2, destinationElement2, errorElement2]}
 * @param {Object} config
 */
function clearForm(form, formSubmitButton, inputs, config) {
  form.reset();
  hideErrorAll(inputs, config);
  disableSubmitButton(formSubmitButton, config);
}

/**
 * Checks if input field is valid according to HTML validation criteria
 * @param {HTMLElement} input
 * @param {HTMLElement} errorElement
 */
function checkInputValidity(input, errorElement) {
  if (!input.validity.valid)
    showError(errorElement, input, config);
  else
    hideError(errorElement, input, config);
}

/**
 * Checks if all inputs are valid
 * @param {Array} inputs
 * @returns {boolean}
 */
function checkInputValidityAll(inputs) {
  return inputs.every(input => input.validity.valid);
}

/**
 * Sets form submit button state depending on validity of its input fields
 * @param {HTMLElement} submitButton
 * @param {Array} inputs
 * @param {Object} config
 */
function setSubmitState(submitButton, inputs, config) {
  if (!checkInputValidityAll(inputs))
    disableSubmitButton(submitButton, config);
  else
    enableSubmitButton(submitButton, config);
}

/**
 * Enables custom HTML/JS validation for all forms
 * @param {Object} config
 */
function enableValidation(config) {
  const forms = Array.from(document.forms);
  forms.forEach(form => {
    const submitButton = form.querySelector('.' + config.submitButton);
    const inputs = Array.from(form.querySelectorAll('.' + config.input));

    inputs.forEach(input => {
      const errorElement = form.querySelector(`.${input.id}-error`);
      input.addEventListener('input', (evt) => {
        checkInputValidity(evt.target, errorElement);
        setSubmitState(submitButton, inputs, config);
      });
    });
  });
}
