import { saveAction } from "../../../../source/scripts/utils";

export const offersForm = () => {
    const offersForm = document.querySelector(`.offersForm`);
    const offersButton = offersForm.querySelector(`.offersButton`);
    const amountField = offersForm.querySelector(`.formField`);
    const amountFieldTitle = amountField.parentNode.querySelector(`.formLabel`);
    const checkboxFields = [...offersForm.querySelectorAll(`.formCheckbox`)];
    const offersButtons = [...document.querySelectorAll(`.offerList`)];
    offersButton.addEventListener(`click`, async (event) => {
        event.preventDefault();
        const activeOffer = offersForm.querySelector(`.activeOffer`);
        const { dataset: { id: offerID }} = activeOffer;
        const offerAmount = amountField.value;
        const link = `https://projects.greensky.com/MerchantLoanApplication?apptype=short&merchant=81016232&dealerplan=${offerID}&channel=External-Button-02&j_id0%3Aj_id1%3Acredit-form%3Aj_id78%3Aj_id79%3AinputId=${offerAmount}&agree-1=Y&agree-2=Y`
        window.open(link);
    });
    const setTitleVisible = () => {
        const isTitleHidden = (amountFieldTitle.classList.contains(`hiddenLabel`));
        const classAction = (isTitleHidden && !amountField.value.length) ? `remove` : `add`;
        amountFieldTitle.classList[classAction](`hiddenLabel`);
    };
    const checkValidation = () => amountField.value = amountField.value.replace(/[^0-9]/g, ``);
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
    amountField.addEventListener(`input`, checkValidation);
    amountField.addEventListener(`input`, checkButtonVisible);
    checkboxFields.forEach((checkbox) => checkbox.addEventListener(`change`, checkButtonVisible));
};