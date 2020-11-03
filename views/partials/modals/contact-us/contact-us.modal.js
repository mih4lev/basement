import { changeModalVisible, setModal } from "../modals";

export const contactUsModal = () => {

    const sendForms = [...document.querySelectorAll(`.sendForm`)];

    const modalNode = setModal(`contact-us`);
    const addButtons = [...document.querySelectorAll(`.contactButton`)];

    // hide modal && button if 2 form on page
    if (sendForms.length > 2) {
        if (!addButtons.length) return false;
        addButtons.forEach((button) => {
            button.classList.add(`hiddenButton`);
            const wrapper = button.closest(`.wrapper`);
            if (wrapper) {
                const footerText = wrapper.querySelector(`.footerText`);
                if (footerText) footerText.classList.add(`fullWrapper`);
            }
        });
        return false;
    }

    // show modal
    addButtons.forEach((addButton) => {
        addButton.addEventListener(`click`, changeModalVisible(modalNode));
        addButton.addEventListener(`click`, () => {
            if (window.innerWidth <= 767) location.href = "#";
        });
    });

};