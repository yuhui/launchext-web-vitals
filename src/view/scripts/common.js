/**
 * Copyright 2021-2023 Yuhui. All rights reserved.
 *
 * Licensed under the GNU General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/** Get the form */
function getForm(formId) {
  const form = document.getElementById(formId);
  return form;
}

/** Get the values from the form */
function getFormValues(formId) {
  const formValues = {};

  const form = getForm(formId);
  if (!form || form.nodeName !== 'FORM') {
    return formValues;
  }

  [...form.elements].forEach((formElement) => {
    const { checked, name, nodeName, options, type, value } = formElement;
    if (name === '') {
      return;
    }

    switch (nodeName) {
      case 'INPUT':
        switch (type) {
          case 'text':
          case 'hidden':
          case 'password':
          case 'button':
          case 'reset':
          case 'submit':
            formValues[name] = value;
            break;
          case 'checkbox':
          case 'radio':
            if (checked) {
              formValues[name] = value;
            } else if (type === 'checkbox') {
              formValues[name] = '';
            }
            break;
        }
        break;
      case 'file':
        break;
      case 'TEXTAREA':
        formValues[name] = value;
        break;
      case 'SELECT':
        switch (type) {
          case 'select-one':
            formValues[name] = value;
            break;
          case 'select-multiple':
            options.forEach((option) => {
              const {selected, value} = option;
              if (selected) {
                formValues[name] = value;
              }
            });
            break;
        }
        break;
      case 'BUTTON':
        switch (type) {
          case 'reset':
          case 'submit':
          case 'button':
            formValues[name] = value;
            break;
        }
        break;
    }
  });

  return formValues;
}

/** Set the values in the form */
// eslint-disable-next-line no-unused-vars
function setFormValues(formId, formValues) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  const form = getForm(formId);
  const formFieldNames = getFormFieldNames(formId);
  formFieldNames.forEach((fieldName) => {
    if (!hasOwnProperty.call(formValues, fieldName)) {
      return;
    }

    const fieldValue = formValues[fieldName];

    if (form[fieldName].type === 'checkbox') {
      form[fieldName].checked = form[fieldName].value === fieldValue;
    } else {
      form[fieldName].value = fieldValue;
    }

    /**
    * IMPORTANT!
    * Coral's <coral-select> and <coral-autocomplete> include a <input> that contains the selected
    * value.
    * Since that <input> isn't a <select>, the <coral-select> / <coral-autocomplete> will show its
    * default value.
    * So the <coral-select> / <coral-autocomplete>'s value needs to be updated to match its <input>
    * value.
    */
    const coralSelectSelector = `coral-select[name="${fieldName}"]`;
    const coralAutocompleteSelector = `coral-autocomplete[name="${fieldName}"]`;
    const coralSelectAutocompleteSelector = `${coralSelectSelector},${coralAutocompleteSelector}`;
    const coralSelect = document.querySelector(`${coralSelectAutocompleteSelector}`);

    if (coralSelect) {
      const coralSelectItemSelector = `coral-select-item[value="${fieldValue}"]`;
      const coralAutocompleteItemSelector = `coral-autocomplete-item[value="${fieldValue}"]`;
      const coralItemSelector = `${coralSelectItemSelector},${coralAutocompleteItemSelector}`;
      const coralItem = coralSelect.querySelector(coralItemSelector);
      coralItem.selected = 'selected';
    }
  });
}

/** Get the names of fields in the form */
// eslint-disable-next-line no-unused-vars
function getFormFieldNames(formId) {
  const formValues = getFormValues(formId);
  return Object.keys(formValues);
}

/** Check if a form value is a data element token */
// eslint-disable-next-line no-unused-vars
function isDataElementToken(formValue) {
  return /^%([^%]+)%$/.test(formValue);
}

/** Convert a string value to an integer */
// eslint-disable-next-line no-unused-vars
function stringToInteger(value) {
  const numberMatch = value.match(/([0-9]+)/);
  return numberMatch ? parseInt(numberMatch[1], 10) : null;
}

/** Check if a value is an integer */
// eslint-disable-next-line no-unused-vars
function valueIsInteger(value) {
  return (`${value}`).length > 0
    && !Number.isNaN(parseInt(value, 10))
    && parseInt(value, 10) === Number(value);
}

/** Show or hide an element based on the value of a form field */
// eslint-disable-next-line no-unused-vars
function toggleElement(formId, toggleField, toggleValue, selectorToToggle) {
  const formValues = getFormValues(formId);
  const toggleFieldValue = formValues[toggleField];

  const elementToShowHide = document.querySelector(selectorToToggle);
  if (toggleFieldValue === toggleValue) {
    elementToShowHide.classList.remove('hide');
    elementToShowHide.classList.add('show');
  } else {
    elementToShowHide.classList.remove('show');
    elementToShowHide.classList.add('hide');
  }
}

/** Show or hide an input's error message based on the validity of that input */
// eslint-disable-next-line no-unused-vars
function toggleInputErrorMessage(inputName, inputIsValid) {
  const inputElement = document.querySelector(`input[name="${inputName}"]`);
  const inputElementGrandparentNode = inputElement.parentNode.parentNode;
  const inputElementGreatGreatGrandparentNode = inputElementGrandparentNode.parentNode.parentNode;
  const errorMessage = inputElementGreatGreatGrandparentNode.querySelector('span.error-message');
  if (inputIsValid) {
    inputElement.classList.remove('spectrum-Alert--error');
    errorMessage.classList.remove('show');
    errorMessage.classList.add('hide');
  } else {
    inputElement.classList.add('spectrum-Alert--error');
    errorMessage.classList.remove('hide');
    errorMessage.classList.add('show');
  }
}
