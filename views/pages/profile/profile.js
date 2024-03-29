import { saveAction, updateAlbumsCount } from "../../../source/scripts/utils";

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
            await updateAlbumsCount();
        };

        deleteCardButton.addEventListener(`click`, changeHoverVisible);
        closeButton.addEventListener(`click`, changeHoverVisible);
        deleteButton.addEventListener(`click`, deleteHandler);

    };

    deleteCardButtons.forEach(deleteCard);

    // add mutationObserver for new albums add
    const uploadObserverOptions = { attributes: true, childList: true };
    const uploadObserverCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
            if (!mutation.addedNodes || !mutation.addedNodes.length) return false;
            [...mutation.addedNodes].forEach((addedNode) => {
                if (!addedNode.classList || !addedNode.classList.contains(`ideaWrapper`)) return false;
                if (addedNode.isLoaded) return false;
                addedNode.isLoaded = true;
                const deleteButton = addedNode.querySelector(`.deleteCardButton`);
                deleteCard(deleteButton);
            });
        });
    };
    const uploadObserver = new MutationObserver(uploadObserverCallback);
    if (ideaList) uploadObserver.observe(ideaList, uploadObserverOptions);

};

const createLink = (link) => {
    const linkNode = document.createElement(`a`);
    linkNode.innerText = `Follow to grant calendar permission`;
    linkNode.setAttribute(`href`, link);
    linkNode.setAttribute(`target`, `_blank`);
    return linkNode;
};

const showSuccessStatus = (tokenTextNode, successMessage) => {
    tokenTextNode.innerHTML = ``;
    const textNode = document.createTextNode(successMessage);
    tokenTextNode.appendChild(textNode);
    tokenTextNode.classList.add(`successToken`);
};

const showErrorStatus = (tokenTextNode, errorMessage) => {
    tokenTextNode.innerHTML = ``;
    const textNode = document.createTextNode(errorMessage);
    tokenTextNode.appendChild(textNode);
    tokenTextNode.classList.add(`requestToken`);
}

const createField = (tokenTextNode) => {
    const fieldNode = document.createElement(`input`);
    fieldNode.setAttribute(`type`, `text`);
    fieldNode.setAttribute(`placeholder`, `enter google code`);
    fieldNode.classList.add(`codeField`);
    tokenTextNode.appendChild(fieldNode);
    const sendButton = document.createElement(`button`);
    sendButton.classList.add(`codeButton`);
    sendButton.innerText = `SAVE`;
    tokenTextNode.appendChild(sendButton);
    sendButton.addEventListener(`click`, async () => {
        sendButton.classList.add(`loadButton`);
        const body = new FormData();
        body.append(`authCode`, fieldNode.value);
        const options = { method: `POST`, body };
        const response = await fetch(`/api/profile/calendar/code`, options);
        const { status } = await response.json();
        if (status !== 1) return showErrorStatus(tokenTextNode, `Token is not stored`);
        showSuccessStatus(tokenTextNode, `Token created successfully`);
    });
};

const checkTokenValid = async () => {
    const response = await fetch(`/api/profile/calendar/valid`);
    const { status } = await response.json();
    return status;
};

export const calendarToken = async () => {
    const tokenTextNode = document.querySelector(`.calendarToken`);
    if (!tokenTextNode) return false;
    // check token valid
    const tokenStatus = await checkTokenValid();
    if (tokenStatus === 1) {
        return showSuccessStatus(tokenTextNode, `Calendar token is valid`);
    }
    // create if is not valid token
    const response = await fetch(`/api/profile/calendar/auth`);
    const { status, link } = await response.json();
    if (status !== 1) return showErrorStatus(tokenTextNode, `Auth link is not created`);
    tokenTextNode.innerHTML = ``;
    const linkNode = createLink(link);
    linkNode.addEventListener(`click`, () => {
        tokenTextNode.removeChild(linkNode);
        createField(tokenTextNode);
    });
    tokenTextNode.appendChild(linkNode);
};

const imageSize = [
    [`(max-width: 479px)`, `image/jpeg`, `_154x154.jpg`, `_308x308.jpg`],
    [`(min-width: 480px)`, `image/jpeg`, `_252x252.jpg`, `_504x504.jpg`]
];

export const albumsIdeasData = (data) => {
    const { ideaID, ideaImage, ideaTitle, ideaAuthor, albumID } = data;
    return [
        {
            type: `picture`, parent: `.imageWrapper`, alt: ideaTitle, image: ideaImage,
            imageSize, selector: `ideaPhoto`, data: `idea`, value: ideaID
        },
        { type: `wrapper`, wrapper: `.ideaWrapper`, data: `album`, value: albumID },
        { type: `text`, selector: `.ideaTitle`, text: ideaTitle },
        { type: `text`, selector: `.ideaAuthor`, text: `By ` + ideaAuthor },
        { type: `hidden`, wrapper: `.deleteButtonsWrapper`, name: `ideaID`, value: ideaID },
        { type: `hidden`, wrapper: `.deleteButtonsWrapper`, name: `albumID`, value: albumID }
    ];
};