import { changeModalVisible, setModal } from "../modals";

export const contactUsModal = () => {

    const modalNode = setModal(`contact-us`);
    const addButtons = [...document.querySelectorAll(`.contactButton`)];

    // show modal
    addButtons.forEach((addButton) => {
        addButton.addEventListener(`click`, changeModalVisible(modalNode));
    });

};