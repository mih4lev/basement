import { saveAction } from "../../../source/scripts/utils";

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

const sendForm = (formNode) => {
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
        const { dataset: { link: URL }} = formNode;
        if (!URL) return false;
        const responseData = await saveAction({ URL, body, button: submitButton });
        if (responseData.status !== 1) return false; // need show error
        const modalNode = submitButton.closest(`.modalSection`);
        modalNode.classList.remove(`activeModal`);
        console.log(responseData);
    };
    if (submitButton) submitButton.addEventListener(`click`, submitHandler);
    // check fields functions
    const radioChecked = `input[type="radio"]:checked`;
    const checkboxChecked = `input[type="checkbox"]:checked`;
    const isRadioChecked = () => !![...formNode.querySelectorAll(radioChecked)].length;
    const isCheckboxChecked = () => !![...formNode.querySelectorAll(checkboxChecked)].length;
    const validFieldsCount = () => textFields.filter((field) => !!field.value).length;
    const selectFieldsCount = () => selectElements.filter((field) => !!field.value).length;
    // progress line
    const progressLine = formNode.querySelector(`.progressLine`);
    const progressHandler = () => {
        if (!progressLine) return false;
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

export const sendForms = () => {
    const formNodes = [...document.querySelectorAll(`.sendForm`)];
    formNodes.forEach(sendForm);
};