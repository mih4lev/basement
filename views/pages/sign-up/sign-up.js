import {saveAction} from "../../partials/modals/modals";

export const signUpForm = () => {

    const formNode = document.querySelector(`.formNode`);
    const formFields = [...formNode.querySelectorAll(`input`)];
    const passwordFields = [...formNode.querySelectorAll(`.passwordField`)];
    const submitButton = formNode.querySelector(`.submitButton`);

    const validateMAP = {
        firstName: /^[a-zA-Z\s]+$/,
        lastName: /^[a-zA-Z\s]+$/,
        userName: /^[a-zA-Z\s]+$/,
        userMail: /\S+@\S+\.\S+/,
        userPassword: /^[a-zA-Z\s]+$/,
        repeatPassword: /^[a-zA-Z\s]+$/
    };

    const checkButtonStatus = () => {
        const filterFunc = (field) => {
            return (field.value && !field.classList.contains(`errorField`));
        };
        let isFieldsValid = formFields.filter((filterFunc)).length === formFields.length;
        // if (passwordField.value !== passwordRepeatField.value) isFieldsValid = false;
        submitButton.disabled = !isFieldsValid;
    };

    formFields.forEach((field) => {
        const selectLabel = field.parentNode.querySelector(`.selectLabel`);
        const fieldLabel = field.parentNode.querySelector(`.fieldLabel`);
        const fieldHandler = (action = `add`) => {
            return () => {
                selectLabel.classList[action](`activeLabel`);
                if (!field.value) fieldLabel.classList[action](`hiddenLabel`);
            }
        };
        const inputHandler = ({ target: fieldNode, target: { id: fieldName, value: fieldValue }}) => {
            const fieldLabel = fieldNode.parentNode.querySelector(`.selectLabel`);
            const isValid = validateMAP[fieldName].test(fieldValue);
            const classAction = (isValid || !fieldValue) ? `remove` : `add`;
            fieldNode.classList[classAction](`errorField`);
            fieldLabel.classList[classAction](`errorLabel`);
            checkButtonStatus();
        };
        field.addEventListener(`focus`, fieldHandler(`add`));
        field.addEventListener(`focusout`, fieldHandler(`remove`));
        field.addEventListener(`input`, inputHandler);
    });

    // check password === repeat password
    passwordFields.forEach((field) => {
        field.addEventListener(`input`, () => {
            const isValidRepeat = (passwordFields[0].value === passwordFields[1].value);
            const classAction = (isValidRepeat) ? `remove` : `add`;
            passwordFields.forEach((field) => {
                const fieldLabel = field.parentNode.querySelector(`.selectLabel`);
                field.classList[classAction](`errorField`);
                fieldLabel.classList[classAction](`errorLabel`);
            });
            checkButtonStatus();
        });
    });

    passwordFields.forEach((field) => {
        field.addEventListener(`focus`, () => field.type = `text`);
        field.addEventListener(`focusout`, () => field.type = `password`);
    });

    const sendFormData = async (event) => {
        event.preventDefault();
        // const requestURL = `/api/profile/settings`;
        // const body = new FormData(formNode);
        // const response = await fetch(requestURL, { method: `POST`, body });
        // const responseData = await response.json();
        const responseOptions = { URL: `/api/profile/settings`, body: new FormData(formNode), button: submitButton };
        const responseData = await saveAction(responseOptions);
        if (responseData.code !== 200) return false; // show error
        location.href = `/profile/`;
        console.log(responseData);
    };

    submitButton.addEventListener(`click`, sendFormData);

};