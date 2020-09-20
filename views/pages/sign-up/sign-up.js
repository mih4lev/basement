import { saveAction } from "../../../source/scripts/utils";

export const signUpForm = () => {

    const formNode = document.querySelector(`.formNode`);
    const formFields = [...formNode.querySelectorAll(`input`)];
    const passwordFields = [...formNode.querySelectorAll(`.passwordField`)];
    const submitButton = formNode.querySelector(`.submitButton`);
    const errorMessage = formNode.querySelector(`.errorMessage`);

    const validateMAP = {
        name: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
        surname: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
        username: /^[a-z0-9_-]{3,15}$/,
        mail: /\S+@\S+\.\S+/,
        password: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/,
        repeatPassword: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/
    };

    const checkButtonStatus = () => {
        const filterFunc = (field) => {
            return (field.value && !field.classList.contains(`errorField`));
        };
        let isFieldsValid = formFields.filter((filterFunc)).length === formFields.length;
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

    const passwordsValid = () => {
        const passwordValid = validateMAP['password'].test(passwordFields[0].value);
        const repeatValid = validateMAP['password'].test(passwordFields[1].value);
        return passwordValid && repeatValid;
    };

    // check password === repeat password
    passwordFields.forEach((field) => {
        const tip = field.closest(`.oneColumnWrapper`).querySelector(`.tipWrapper`);
        field.addEventListener(`focus`, () => {
            tip.classList.add(`visibleWrapper`);
        });
        field.addEventListener(`focusout`, () => {
            tip.classList.remove(`visibleWrapper`);
            const isValidRepeat = (passwordFields[0].value === passwordFields[1].value);
            const classAction = (isValidRepeat && passwordsValid()) ? `remove` : `add`;
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
        const body = new FormData(formNode);
        const responseOptions = { URL: `/api/users/signup`, body, button: submitButton };
        const defaultError = `Connection error, try again.`;
        const { status, error = defaultError } = await saveAction(responseOptions);
        if (status === 1) return location.href = `/profile/`;
        errorMessage.classList.remove(`hiddenMessage`);
        errorMessage.innerText = error;
    };

    submitButton.addEventListener(`click`, sendFormData);

};