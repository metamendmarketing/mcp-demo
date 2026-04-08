

//var firstName = document.getElementById("firstName");
//var lastName = document.getElementById("lastName");
const firstNameEL = document.querySelector('#firstName');
const lastNameEL = document.querySelector('#lastName');
const emailEL = document.querySelector('#email');
const postalEL = document.querySelector('#postal');
const acceptPrivacyEL = document.querySelector('#acceptPrivacy');

const form = document.querySelector('#FinderForm');
const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;

const showError = (input, message) => {
    // get the form-field element
    //const formField = input.parentElement;
    const formField = input;
    //const formFieldCheck = input.parentElement.querySelector('errorCheck');

    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');
    //formFieldCheck.classList.remove('success');
/*    formFieldCheck.classList.add('error');*/

    // show the error message
    const error = formField.parentElement.querySelector('small');
    
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}

const checkFirstName = () => {
    let valid = false;
    const min = 3,
        max = 25;

    const firstName = firstNameEL.value.trim();
    if (!isRequired(firstName)) {
        showError(firstNameEL, 'First Name cannot be blank.');
    } else if (!isBetween(firstName.length, min, max)) {
        showError(firstNameEL, 'First Name must be between ${min} and ${max} characters.');
    } else {
        showSuccess(firstNameEL);
        valid = true;
    }
    return valid;
}

const checkLastName = () => {
    let valid = false;
    const min = 3,
        max = 25;

    const lastName = lastNameEL.value.trim();

    if (!isRequired(lastName)) {
        showError(lastNameEL, 'Last Name cannot be blank.');
    } else if (!isBetween(lastName.length, min, max)) {
        showError(lastNameEL, 'Last Name must be between ${min} and ${max} characters.')
    } else {
        showSuccess(lastNameEL);
        valid = true;
    }
    return valid;
}

const checkEmail = () => {
    let valid = false;
    const email = emailEL.value.trim();

    //alert(email);

    if (!isRequired(email)) {
        showError(emailEL, 'Email Address cannot be blank.');
    } else if (!isEmailValid(email)) {
        showError(emailEL, 'Email is not valid.')
    } else {
        showSuccess(emailEL);
        valid = true;
    }
    return valid;
}

const checkPostal = () => {
    let valid = false;
    const min = 3,
        max = 25;

    const postal = postalEL.value.trim();
    if (!isRequired(postal)) {
        showError(postalEL, 'Postal Code cannot be blank.');
    } else if (!isBetween(postal.length, min, max)) {
        showError(postalEL, `Postal must be between ${min} and ${max} characters.`)
    } else {
        showSuccess(postalEL);
        valid = true;
    }
    return valid;
}

const acceptPrivacy = () => {
    let valid = false;

    const acceptPrivacy = acceptPrivacyEL;
    
    if (acceptPrivacy.checked === false) {
        showError(acceptPrivacyEL, 'You must agree to the terms to submit.')
    }

    if (acceptPrivacy.checked === true) {
        showSuccess(acceptPrivacyEL);
        valid = true;
    }

    let result = "checked: " + acceptPrivacy.checked + " valid: " + valid;
    //alert(result);
    return valid;
}

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();
    let infoString = firstName.value + " " + lastName.value + " " + email.value;
    //alert(infoString);

    // validate forms
    let isFirstNameValid = checkFirstName(),
        isLastNameValid = checkLastName(),
        isEmailValid = checkEmail(),
        isAcceptPrivacyValid = acceptPrivacy(),
        isPostalValid = checkPostal();

    let isFormValid = isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isAcceptPrivacyValid &&
        isPostalValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        //alert('valid');
        document.getElementById("FinderForm").submit();
    }

});


