import { changeModalVisible, setModal } from "../modals";
import {
    createScroll, resetDropEvents, saveAction, updateAlbumsCount
} from "../../../../source/scripts/utils";

const uploadPhoto = (modalNode) => {
    const dropZone = document.querySelector(`.coverWrapper`);
    const createCoverPhoto = () => {
        const coverPhoto = document.createElement(`img`);
        coverPhoto.classList.add(`coverPhoto`);
        dropZone.appendChild(coverPhoto);
        return coverPhoto;
    };
    const createPhotoField = modalNode.querySelector(`.coverField`);
    // upload success handler
    const uploadSuccessHandler = (filename) => {
        return ({ target: { result: generatedURL }}) => {
            const coverNode = dropZone.querySelector(`.coverPhoto`) || createCoverPhoto();
            coverNode.setAttribute(`alt`, filename);
            coverNode.src = generatedURL;
        }
    };
    // upload error handler
    const uploadErrorHandler = (error) => console.log(error);
    // show upload files
    const showUploadFiles = () => {
        [...createPhotoField.files].forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, uploadSuccessHandler(file.name));
            reader.addEventListener(`error`, uploadErrorHandler);
            reader.readAsDataURL(file);
        });
    };
    // drag&drop
    const dropHandler = (event) => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        createPhotoField.files = event.dataTransfer.files;
        showUploadFiles();
    };
    if (dropZone) resetDropEvents([ dropZone ]);
    if (dropZone) dropZone.addEventListener(`drop`, dropHandler);
    // file upload
    createPhotoField.addEventListener(`change`, () => {
        if (!createPhotoField.files || !createPhotoField.files.length) return false;
        showUploadFiles();
    });
}

const addCreatedListeners = (modalNode) => {
    const createAlbumField = modalNode.querySelector(`.titleField`);
    const createAlbumLabel = modalNode.querySelector(`.titleLabel`);
    const showFieldTitle = (event) => {
        event.preventDefault();
        const isTitleHidden = createAlbumLabel.classList.contains(`hiddenLabel`);
        const isEmpty = !createAlbumField.value;
        const classAction = isTitleHidden && isEmpty ? `remove` : `add`;
        createAlbumLabel.classList[classAction](`hiddenLabel`);
        checkButtonStatus(modalNode);
    };
    const setFieldVisible = () => {
        const isTyped = createAlbumField.value;
        const classAction = (isTyped) ? `add` : `remove`;
        createAlbumField.classList[classAction](`typedField`);
    };
    createAlbumField.addEventListener(`focus`, showFieldTitle);
    createAlbumField.addEventListener(`blur`, showFieldTitle);
    createAlbumField.addEventListener(`change`, setFieldVisible);
    // update
    uploadPhoto(modalNode);
}

const updateIdeaCount = async (ideaID) => {
    const countNode = document.querySelector(`.saveCount .countWrapper`);
    const response = await fetch(`/api/ideas/${ideaID}`);
    const responseData = await response.json();
    if (!responseData.ideaID) return false;
    const { saveCount } = responseData;
    countNode.innerText = saveCount;
};

const sendData = (modalNode) => {
    return async (event) => {
        event.preventDefault();
        const formNode = event.target.closest(`form`);
        const formData = new FormData(formNode);
        const responseOptions = { URL: `/api/profile/ideas/save`, body: formData, button: event.target };
        const responseData = await saveAction(responseOptions);
        if (responseData.status !== 1) return false; // show error
        // update idea count
        const ideaID = formData.get(`ideaID`);
        await updateIdeaCount(ideaID);
        changeModalVisible(modalNode)();
        await updateAlbumsCount();
    }
};

const checkButtonStatus = (modalNode) => {
    const titleField = modalNode.querySelector(`.titleField`);
    const submitButton = modalNode.querySelector(`.submitButton`);
    const isTyped = !!titleField.value;
    const albumNodes = [...modalNode.querySelectorAll(`.albumList .album`)];
    const filterChosen = (albumNode) => albumNode.classList.contains(`activeAlbum`);
    submitButton.disabled = !isTyped && !albumNodes.filter(filterChosen).length;
};

const createHiddenField = (albumID) => {
    const hiddenField = document.createElement(`input`);
    hiddenField.classList.add(`hiddenField`);
    hiddenField.setAttribute(`type`, `hidden`);
    hiddenField.setAttribute(`name`, `savedAlbums`);
    hiddenField.setAttribute(`value`, albumID);
    return hiddenField;
};

const checkHiddenFields = (modalNode) => {
    const albums = [...modalNode.querySelectorAll(`.album`)];
    const albumsHandler = (albumNode) => {
        const { dataset: { album: albumID }} = albumNode;
        const isActiveAlbum = albumNode.classList.contains(`activeAlbum`);
        const hiddenField = albumNode.querySelector(`.hiddenField`);
        // delete hiddenField if not active
        if (hiddenField && !isActiveAlbum) albumNode.removeChild(hiddenField);
        // add hiddenField if not exist hiddenField
        if (!hiddenField && isActiveAlbum) albumNode.appendChild(createHiddenField(albumID));
    };
    albums.forEach(albumsHandler);
};

const createModal = async (event) => {

    if (event.target.classList.contains(`userIdea`)) return false;
    if (event.target.classList.contains(`unLoginIdea`)) return false;

    const { target: { dataset: { idea: ideaID }}} = event;

    // remove old modal
    const existModal = document.querySelector(`[data-modal="save-idea"]`);
    if (existModal) document.querySelector(`body`).removeChild(existModal);

    // clicked button photo
    const clickedWrapper = event.target.closest(`.ideaWrapper`);
    const photoNode = (clickedWrapper) ? clickedWrapper.querySelector(`.ideaPhoto`) :
                      document.querySelector(`.ideaPhoto[data-idea="${ideaID}"]`);

    // create modal clone
    const templateNode = document.querySelector(`.saveIdeaTemplate`);
    const cloneNode = templateNode.content.querySelector(`section`).cloneNode(true);

    // change modal data
    const modalPhoto = cloneNode.querySelector(`.ideaPhoto`);
    modalPhoto.src = photoNode.src;

    //
    document.querySelector(`body`).appendChild(cloneNode);
    const modalNode = setModal(`save-idea`);
    changeModalVisible(modalNode)();

    const formNode = modalNode.querySelector(`.formWrapper`);
    const loaderNode = modalNode.querySelector(`.loaderWrapper`);

    const ideaIDField = modalNode.querySelector(`[name="ideaID"]`);
    ideaIDField.value = ideaID;

    // request albums data
    const response = await fetch(`/api/ideas/albums/${ideaID}`);
    const responseData = await response.json();

    const albumsWrapper = modalNode.querySelector(`.albumList`);
    const albumClone = albumsWrapper.querySelector(`.album`).cloneNode(true);
    albumsWrapper.innerHTML = ``;

    // check submit button status
    const submitButton = modalNode.querySelector(`.submitButton`);
    submitButton.addEventListener(`click`, sendData(modalNode));
    formNode.addEventListener(`submit`, sendData(modalNode));

    // add create field listeners
    addCreatedListeners(modalNode);

    // add listeners to albumNode
    const addListeners = (albumNode) => {
        const chooseHandler = () => {
            const isChosen = (albumNode.classList.contains(`activeAlbum`));
            const classAction = (isChosen) ? `remove` : `add`;
            albumNode.classList[classAction](`activeAlbum`);
            checkButtonStatus(modalNode);
            checkHiddenFields(modalNode);
        }
        albumNode.addEventListener(`click`, chooseHandler);
        // add touch events
        let startValue;
        albumNode.addEventListener(`touchstart`, (event) => {
            startValue = event.changedTouches[0].pageY;
        });
        albumNode.addEventListener(`touchend`, (event) => {
            const scrollExist = modalNode.querySelector(`.scrollLine`);
            if (!scrollExist) return false;
            const endedValue = event.changedTouches[0].pageY;
            const movedValue = endedValue - startValue;
            const isTouch = !(movedValue > 5 || movedValue + 5 < 0);
            if (isTouch) chooseHandler();
        });
    };

    //
    const createAlbumNode = (albumData) => {
        const { albumID, albumTitle, albumCover, isSaved } = albumData;
        const albumNode = albumClone.cloneNode(true);
        albumNode.dataset.album = albumID;
        const coverNode = albumNode.querySelector(`.albumCover`);
        if (albumCover) coverNode.src = albumCover + `_54x54.jpg`;
        if (!albumCover) coverNode.classList.add(`defaultCover`);
        const titleNode = albumNode.querySelector(`.albumTitle`);
        titleNode.innerText = albumTitle;
        addListeners(albumNode);
        if (isSaved) albumNode.classList.add(`activeAlbum`);
        albumNode.classList.remove(`hiddenAlbum`);
        albumsWrapper.appendChild(albumNode);
    }
    responseData['albums'].forEach(createAlbumNode);
    checkHiddenFields(modalNode);
    checkButtonStatus(modalNode);

    // create scroll
    createScroll(albumsWrapper, 3);

    // show albums
    loaderNode.classList.add(`hiddenWrapper`);

};

export const saveIdeaModal = () => {

    const saveIdeaButtons = [...document.querySelectorAll(`.saveIdea`)];

    // show modal
    const showModal = (saveButton) => saveButton.addEventListener(`click`, createModal);
    saveIdeaButtons.forEach(showModal);

    // observe new elements
    const elementsWrapper = document.querySelector(`.elementsWrapper`);
    const callback = (mutationsList) => {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!node.classList || !node.classList.contains(`ideaWrapper`)) return false;
                const saveButton = [...node.querySelectorAll(`.saveIdea`)];
                saveButton.forEach(showModal);
            });
        });
    };
    const observer = new MutationObserver(callback);
    if (elementsWrapper) observer.observe(elementsWrapper, { childList: true });
};