import { saveAction } from "../../../../source/scripts/utils";

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
            const responseOptions = {
                URL: `/api/booking`, body: formData, button: zipCodeButton, isShowLoaded: false
            };
            zipCodeLoader.classList.remove(`hiddenLoader`);
            const responseData = await saveAction(responseOptions);
            if (responseData.status !== 1) return false; // show error
            const { calendar: { data }, userID} = responseData;
            const calendarEvent = new CustomEvent(`bookingData`, { detail: { data, userID }});
            document.dispatchEvent(calendarEvent);
            // hide loader && show go button
            zipCodeLoader.classList.add(`hiddenLoader`);
            zipCodeButton.classList.remove(`loadButton`);
            zipCodeButton.classList.remove(`loadedButton`);
            zipCodeButton.disabled = false;
            // reset schedule button view to default
            zipCodeField.value = ``;
            scheduleButton.classList.remove(`hiddenButton`);
            zipCodeForm.classList.add(`hiddenWrapper`);
        }
        zipCodeButton.addEventListener(`click`, sendZipCodeData);
        zipCodeForm.addEventListener(`submit`, sendZipCodeData);
    });
};