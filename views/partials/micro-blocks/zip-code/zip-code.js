import { saveAction } from "../../modals/modals";

export const zipCodeButtons = () => {
    const scheduleButtons = [...document.querySelectorAll(`.consultationButton`)];
    scheduleButtons.forEach((scheduleButton) => {
        const scheduleWrapper = scheduleButton.closest(`.scheduleWrapper`);
        if (!scheduleWrapper) return false;
        const zipCodeForm = scheduleWrapper.querySelector(`.zipCodeForm`);
        const zipCodeField = scheduleWrapper.querySelector(`.zipCodeField`);
        const zipCodeButton = scheduleWrapper.querySelector(`.zipCodeButton`);
        const zipCodeLoader = scheduleWrapper.querySelector(`.zipCodeLoader`);
        scheduleButton.addEventListener(`click`, (event) => {
            event.preventDefault();
            const wrapperWidth = scheduleButton.offsetWidth;
            scheduleWrapper.style.width = `${wrapperWidth}px`;
            scheduleButton.classList.add(`hiddenButton`);
            // replace old for new block
            zipCodeForm.classList.remove(`hiddenWrapper`);
            zipCodeField.focus();
        });
        // form handler
        const sendZipCodeData = async (event) => {
            event.preventDefault();
            const formData = new FormData(zipCodeForm);
            const responseOptions = { URL: `/api/zip-code`, body: formData, button: zipCodeButton };
            zipCodeLoader.classList.remove(`hiddenLoader`);
            const responseData = await saveAction(responseOptions);
            if (responseData.code !== 200) return false; // show error
            zipCodeLoader.classList.add(`hiddenLoader`);
            console.log(responseData);
            zipCodeButton.classList.add(`loadedButton`);
        }
        zipCodeButton.addEventListener(`click`, sendZipCodeData);
        zipCodeForm.addEventListener(`submit`, sendZipCodeData);
    });
};