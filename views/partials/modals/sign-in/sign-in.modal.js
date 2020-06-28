import { changeModalVisible, setModal } from "../modals";

export const signInModal = () => {

    const modalNode = setModal(`sign-in`);
    const loginButtons = [...document.querySelectorAll(`.userLogin`)];
    loginButtons.forEach((loginButton) => {
        loginButton.addEventListener(`click`, changeModalVisible(modalNode));
    });

};