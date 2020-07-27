import { saveAction } from "../../../partials/modals/modals";

export const offersForm = () => {
    const offersForm = document.querySelector(`.offersForm`);
    const offersButton = offersForm.querySelector(`.offersButton`);
    const amountField = offersForm.querySelector(`.formField`);
    const amountFieldTitle = amountField.parentNode.querySelector(`.formLabel`);
    const checkboxFields = [...offersForm.querySelectorAll(`.formCheckbox`)];
    const offersButtons = [...document.querySelectorAll(`.offerList`)];
    offersButton.addEventListener(`click`, async (event) => {
        event.preventDefault();
        const formData = new FormData(offersForm);
        const responseOptions = { URL: `/api/offer`, body: formData, button: offersButton };
        const responseData = await saveAction(responseOptions);
        if (responseData.code !== 200) return false; // show error
        offersButton.classList.add(`loadedButton`);
        console.log(responseData);
        console.log(`redirect to another location`);
    });
    const setTitleVisible = () => {
        const isTitleHidden = (amountFieldTitle.classList.contains(`hiddenLabel`));
        const classAction = (isTitleHidden && !amountField.value.length) ? `remove` : `add`;
        amountFieldTitle.classList[classAction](`hiddenLabel`);
    };
    const checkButtonVisible = () => {
        const isValid = !!amountField.value.length && [...(new FormData(offersForm))].length === 4;
        offersButton.disabled = !isValid;
    };
    const createHiddenField = () => {
        const createdNode = document.createElement(`input`);
        createdNode.classList.add(`offerValue`);
        createdNode.setAttribute(`type`, `hidden`);
        createdNode.setAttribute(`name`, `offerValue`);
        offersForm.appendChild(createdNode);
        return createdNode;
    };
    const updateHiddenField = (offerValue) => {
        const hiddenField = offersForm.querySelector(`.offerValue`) || createHiddenField();
        hiddenField.setAttribute(`value`, offerValue);
    };
    // check for sessionStorage
    if (sessionStorage.getItem(`offer`)) {
        const offerValue = sessionStorage.getItem(`offer`);
        updateHiddenField(offerValue);
    }
    // check for offer buttons click
    const offerClickHandler = (event) => {
        const { target: { dataset: { offer: offerValue }}} = event;
        if (!offerValue) return false;
        updateHiddenField(offerValue);
    };
    offersButtons.forEach((offerNode) => {
        offerNode.addEventListener(`click`, offerClickHandler);
    })
    // add listeners to fields
    amountField.addEventListener(`focusin`, setTitleVisible);
    amountField.addEventListener(`focusout`, setTitleVisible);
    amountField.addEventListener(`input`, checkButtonVisible);
    checkboxFields.forEach((checkbox) => checkbox.addEventListener(`change`, checkButtonVisible));
};