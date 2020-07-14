import { saveAction } from "../../views/partials/modals/modals";

export const webpCheck = () => {
    const canvas = document.createElement(`canvas`);
    let canUseWebp = false;
    if (!!(canvas.getContext && canvas.getContext(`2d`))) {
        canUseWebp = canvas.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0;
    }
    const htmlNode = document.querySelector(`html`);
    const webpClass = (canUseWebp) ? `webp` : `no-webp`;
    htmlNode.classList.add(webpClass);
};

export const titleWidth = () => {
    const titleNode = document.querySelector(`title`);
    const checkWidth = () => titleNode.innerText = `DEV ${window.innerWidth}`;
    window.addEventListener(`resize`, checkWidth);
    checkWidth();
};

export const selectElements = () => {
    const selectElements = [...document.querySelectorAll(`.selectElement`)];
    selectElements.forEach((selectNode) => {
        const currentSelectData = selectNode.querySelector(`.currentSelectData`);
        const selectDataElements = [...selectNode.querySelectorAll(`.selectData`)];
        const hiddenField = selectNode.querySelector(`.hiddenField`);
        selectDataElements.forEach((selectData) => {
            selectData.addEventListener(`click`, () => {
                const { dataset: { select: chooseData }} = selectData;
                // remove empty data class && change select data
                currentSelectData.classList.remove(`emptyData`);
                currentSelectData.innerText = chooseData;
                // change active select element
                selectDataElements.forEach((selectData) => selectData.classList.remove(`selectedData`));
                selectData.classList.add(`selectedData`);
                // change hidden field value
                hiddenField.value = chooseData;
            });
        });
        selectNode.addEventListener(`click`, () => {
            const isSelectActive = selectNode.classList.contains(`activeSelectElement`);
            const classAction = (isSelectActive) ? `remove` : `add`;
            selectElements.forEach((selectElement) => selectElement.classList.remove(`activeSelectElement`));
            selectNode.classList[classAction](`activeSelectElement`);
        });
    });
};

export const contactForm = () => {
    const formNode = document.querySelector(`.contactFormWrapper`);
    const submitButton = formNode.querySelector(`.submitButton`);
    const textFields = [...formNode.querySelectorAll(`input[type="text"], textarea`)];
    const checkboxElements = [...formNode.querySelectorAll(`input[type="checkbox"]`)];
    const radioElements = [...formNode.querySelectorAll(`input[type="radio"]`)];
    const selectElements = [...formNode.querySelectorAll(`input[type="hidden"]`)];
    // show|hide labels
    textFields.forEach((field) => {
        const fieldLabel = field.parentNode.querySelector(`.fieldLabel`);
        const fieldHandler = (action = `add`) => {
            return () => {
                if (!field.value) fieldLabel.classList[action](`hiddenLabel`);
            }
        };
        field.addEventListener(`focus`, fieldHandler(`add`));
        field.addEventListener(`focusout`, fieldHandler(`remove`));
    });
    // submit listener
    const submitHandler = async (event) => {
        event.preventDefault();
        const body = new FormData(formNode);
        const responseData = await saveAction({ URL: `/api/contact`, body, button: submitButton });
        if (responseData.code !== 200) return false; // need show error
    };
    if (submitButton) submitButton.addEventListener(`click`, submitHandler);
    // check fields functions
    const radioChecked = `input[type="radio"]:checked`;
    const checkboxChecked = `input[type="checkbox"]:checked`;
    const isRadioChecked = () => !![...document.querySelectorAll(radioChecked)].length;
    const isCheckboxChecked = () => !![...document.querySelectorAll(checkboxChecked)].length;
    const validFieldsCount = () => textFields.filter((field) => !!field.value).length;
    const selectFieldsCount = () => selectElements.filter((field) => !!field.value).length;
    // progress line
    const progressLine = document.querySelector(`.progressLine`);
    const progressHandler = () => {
        const steps = Number(formNode.dataset.steps);
        let progress = validFieldsCount() + selectFieldsCount();
        if (isRadioChecked()) progress += 1;
        if (isCheckboxChecked()) progress += 1;
        progressLine.style.width = (progress === steps) ? `100%` : `${(100 / steps) * progress}%`;
    };
    // add fields listeners
    textFields.forEach((field) => field.addEventListener(`input`, progressHandler));
    checkboxElements.forEach((checkbox) => checkbox.addEventListener(`change`, progressHandler));
    radioElements.forEach((radio) => radio.addEventListener(`change`, progressHandler));
    // mutationObserver for hidden elements
    const mutationObserver = new MutationObserver(progressHandler);
    selectElements.forEach((selectElement) => {
        mutationObserver.observe(selectElement, { attributes: true });
    });
};

export const instantQuoteForm = () => {

};