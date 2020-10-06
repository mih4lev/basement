import {saveAction} from "../../../../source/scripts/utils";

export const zipCodeButtons = () => {
    const scheduleButtons = [...document.querySelectorAll(`.consultationButton`)];
    scheduleButtons.forEach((scheduleButton) => {
        const scheduleWrapper = scheduleButton.closest(`.scheduleWrapper`);
        if (!scheduleWrapper) return false;
        const zipCodeForm = scheduleWrapper.querySelector(`.zipCodeForm`);
        const zipCodeField = scheduleWrapper.querySelector(`.zipCodeField`);
        const zipCodeButton = scheduleWrapper.querySelector(`.zipCodeButton`);
        const zipCodeLoader = scheduleWrapper.querySelector(`.zipCodeLoader`);
        const errorWrapper = scheduleWrapper.querySelector(`.errorWrapper`);
        scheduleButton.addEventListener(`click`, (event) => {
            event.preventDefault();
            const wrapperWidth = scheduleButton.offsetWidth;
            scheduleWrapper.style.width = `${wrapperWidth}px`;
            scheduleButton.classList.add(`hiddenButton`);
            // replace old for new block
            zipCodeForm.classList.remove(`hiddenWrapper`);
            zipCodeField.focus();
        });
        let isActive = false;
        const showError = (errorMessage) => {
            if (isActive) return false;
            errorWrapper.innerText = errorMessage;
            errorWrapper.classList.remove(`hiddenWrapper`);
            isActive = true;
            setTimeout(() => {
                errorWrapper.classList.add(`hiddenWrapper`);
                isActive = false;
            }, 3000);
        };
        const checkZipCode = () => {
            const regex = /^\d{5}[-\s]?(?:\d{4})?$/gm;
            if (!zipCodeField.value) {
                showError(`Please enter the zip code`);
                return false;
            }
            if (!regex.test(zipCodeField.value)) {
                showError(`Invalid zip code format`);
                return false;
            }
            return true;
        };
        // form handler
        const sendZipCodeData = async (event) => {
            event.preventDefault();
            if (!checkZipCode()) return false;
            const formData = new FormData(zipCodeForm);
            const responseOptions = {
                URL: `/api/booking`, body: formData, button: zipCodeButton, isShowLoaded: false
            };
            zipCodeLoader.classList.remove(`hiddenLoader`);
            const responseData = await saveAction(responseOptions);
            if (responseData.status !== 1) {
                const errorMessage = `Unfortunately, your ZIP code is currently outside of Basement Masters service area. Stay tuned for updates.`;
                zipCodeLoader.classList.add(`hiddenLoader`);
                zipCodeButton.classList.remove(`loadButton`);
                zipCodeButton.classList.remove(`loadedButton`);
                zipCodeButton.disabled = false;
                return showError(errorMessage);
            }
            // comment for temp 'youcanbookme' redirect
            // const { calendar: { data }, userID, timeStart, timeEnd } = responseData;
            // const eventData = { data, userID, timeStart, timeEnd };
            // const calendarEvent = new CustomEvent(`bookingData`, { detail: eventData});
            // document.dispatchEvent(calendarEvent);
            // TEMP redirect (add referrer to link)
            // TEMP BEGIN
            if (!sessionStorage.getItem(`referrer`)) {
                const referrer = document.referrer || `direct`;
                sessionStorage.setItem(`referrer`, referrer);
            }
            const referrer = sessionStorage.getItem(`referrer`);
            window.open(responseData.link + `/?REFERRER=${referrer}`);
            // TEMP END
            // hide loader && show go button
            zipCodeLoader.classList.add(`hiddenLoader`);
            zipCodeButton.classList.remove(`loadButton`);
            zipCodeButton.classList.remove(`loadedButton`);
            zipCodeButton.disabled = false;
            // reset schedule button view to default
            zipCodeField.value = ``;
            scheduleButton.classList.remove(`hiddenButton`);
            zipCodeForm.classList.add(`hiddenWrapper`);
        };
        // check input field data for number
        const checkInputData = () => {
            zipCodeField.value = zipCodeField.value.replace(/[^0-9\s\-]/g, ``);
        };
        // listeners
        zipCodeButton.addEventListener(`click`, sendZipCodeData);
        zipCodeForm.addEventListener(`submit`, sendZipCodeData);
        zipCodeField.addEventListener(`input`, checkInputData);
        zipCodeField.addEventListener(`change`, checkInputData);
    });
};