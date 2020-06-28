import { saveAction } from "../../partials/modals/modals";

export const showDeleteWrappers = () => {

    const deleteCardButtons = [...document.querySelectorAll(`.deleteCardButton`)];
    const ideaList = document.querySelector(`.ideaList`);

    const deleteCard = (deleteCardButton) => {

        const parentWrapper = deleteCardButton.closest(`.ideaPhotoWrapper`);
        const deleteWrapper = parentWrapper.querySelector(`.hoverCardWrapper`);
        const closeButton = deleteWrapper.querySelector(`.cancelButton`);
        const deleteButton = deleteWrapper.querySelector(`.deleteButton`);

        const changeHoverVisible = () => {
            const isModalActive = deleteWrapper.classList.contains(`activeHover`);
            const modalClassAction = (isModalActive) ? `remove` : `add`;
            deleteWrapper.classList[modalClassAction](`activeHover`);
            deleteCardButton.classList[modalClassAction](`hiddenButton`);
        };

        const deleteHandler = async () => {
            const parentWrapper = deleteButton.closest(`.ideaWrapper`);
            const ideaID = parentWrapper.dataset.idea;
            const responseOptions = {
                URL: `/api/ideas`,
                method: `DELETE`,
                isJSON: true,
                body: { ideaID },
                button: deleteButton
            }
            const responseData = await saveAction(responseOptions);
            if (responseData.code !== 200) return false; // show error
            // hide delete wrapper
            parentWrapper.parentNode.removeChild(parentWrapper);
        };

        deleteCardButton.addEventListener(`click`, changeHoverVisible);
        closeButton.addEventListener(`click`, changeHoverVisible);
        deleteButton.addEventListener(`click`, deleteHandler);

    };

    deleteCardButtons.forEach(deleteCard);

    // add mutationObserver for new albums add
    const observerOptions = { attributes: true, childList: true };
    const observerCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
            if (!mutation.addedNodes || !mutation.addedNodes.length) return false;
            if (!mutation.nextSibling) return false;
            [...mutation.addedNodes].forEach((ideaWrapper) => {
                const deleteButton = ideaWrapper.querySelector(`.deleteCardButton`);
                deleteCard(deleteButton);
            });
        });
    };
    const observer = new MutationObserver(observerCallback);
    if (ideaList) observer.observe(ideaList, observerOptions);

};