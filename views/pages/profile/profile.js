import { saveAction } from "../../../source/scripts/utils";

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

        const removeFromAlbum = (albumID) => {
            const albumSelector = `.albumWrapper[data-album="${albumID}"]`;
            const albumWrapper = document.querySelector(albumSelector);
            if (!albumWrapper) return false;
            const albumCountNode = albumWrapper.querySelector(`.albumPicturesCount`);
            const albumCountPrevious = Number(albumCountNode.innerText);
            const newCountValue = albumCountPrevious - 1;
            if (newCountValue !== 0) return albumCountNode.innerText = albumCountPrevious - 1;
            const albumCoverWrapper = albumWrapper.querySelector(`.albumCoverWrapper`);
            albumCoverWrapper.removeChild(albumCountNode);
        };

        const deleteHandler = async () => {
            const { dataset: { api: URL }} = deleteButton;
            const parentWrapper = deleteButton.closest(`.ideaWrapper`);
            const formNode = parentWrapper.querySelector(`.formWrapper`);
            const formData = new FormData(formNode);
            const options = { URL, method: `DELETE`, body: formData, button: deleteButton };
            const response = await saveAction(options);
            if (response.status !== 1) return false; // show error
            removeFromAlbum(parentWrapper.dataset.album);
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