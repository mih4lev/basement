import { changeModalVisible, setModal } from "../modals";
import { saveAction } from "../../../../source/scripts/utils";

const validateMAP = {
    mail: /\S+@\S+\.\S+/,
    password: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/
};

export const signInModal = () => {

    const modalNode = setModal(`sign-in`);
    const loginButtons = [...document.querySelectorAll(`.userLogin`)];
    const signButton = modalNode.querySelector(`.submitButton`);
    const formNode = modalNode.querySelector(`form`);
    const fields = [...modalNode.querySelectorAll(`.fieldInput`)];
    const errorMessage = modalNode.querySelector(`.errorMessage`);

    const checkButtonStatus = () => {
        const filterFunc = (field) => {
            return (field.value && !field.classList.contains(`errorField`));
        };
        let isFieldsValid = fields.filter((filterFunc)).length === fields.length;
        signButton.disabled = !isFieldsValid;
    };

    fields.forEach((field) => {
        const { name: fieldName } = field;
        field.addEventListener(`input`, () => {
            const isValid = validateMAP[fieldName].test(field.value);
            const classAction = (isValid || !field.value) ? `remove` : `add`;
            field.classList[classAction](`errorField`);
            checkButtonStatus();
        });
        field.addEventListener(`focus`, () => {
            errorMessage.classList.add(`hiddenMessage`);
        });
    });

    loginButtons.forEach((loginButton) => {
        loginButton.addEventListener(`click`, changeModalVisible(modalNode));
    });

    signButton.addEventListener(`click`, async (event) => {
        event.preventDefault();
        const body = new FormData(formNode);
        const URL = `/api/users/login`;
        const requestOptions = { URL, body, button: signButton };
        const { status, error } = await saveAction(requestOptions);
        if (status === 1) return location.reload();
        errorMessage.classList.remove(`hiddenMessage`);
        errorMessage.innerText = error;
    });

};