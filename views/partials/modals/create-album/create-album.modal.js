import { setButtonStatus } from "../modals";

export const createAlbumModal = () => {

    // show modal
    const createButtons = [...document.querySelectorAll(`.createAlbumButton`)];
    const createModal = document.querySelector(`.createAlbumModal`);
    const closeModalButton = createModal.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = createModal.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        createModal.classList[modalClassAction](`activeModal`);
    };
    createButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
    // edit modal data
    const createAlbumModal = document.querySelector(`.createAlbumWrapper`);
    const photoField = createAlbumModal.querySelector(`.photoField`);
    const photoLabel = createAlbumModal.querySelector(`.photoLabel`);
    const coverWrapper = createAlbumModal.querySelector(`.albumField`);
    const albumTitle = createAlbumModal.querySelector(`.fieldInput`);
    const createButton = createAlbumModal.querySelector(`.submitButton`);
    // remove default drag && drop browser API
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (event) => event.preventDefault();
    dropEvents.forEach((eventName) => {
        photoLabel.addEventListener(eventName, removeBrowserAPI);
    });
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                const coverNode = document.createElement(`img`);
                coverNode.src = reader.result;
                coverNode.classList.add(`inputFieldPicture`);
                coverNode.setAttribute(`alt`, file.name);
                coverWrapper.appendChild(coverNode);
                photoLabel.classList.add(`editLabel`);
                checkButtonStatus();
            });
            reader.addEventListener(`error`, () => {
                console.log(`error`);
            });
            reader.readAsDataURL(file);
        });
    };
    photoField.addEventListener(`change`, () => {
        if (!photoField.files || !photoField.files.length) return false;
        showUploadFiles([...photoField.files]);
    });
    photoLabel.addEventListener(`dragenter`, () => {
        photoLabel.classList.add(`dropOver`);
    });
    photoLabel.addEventListener(`dragleave`, () => {
        photoLabel.classList.remove(`dropOver`);
    });
    photoLabel.addEventListener(`drop`, (event) => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
        photoLabel.classList.remove(`dropOver`);
    });
    // check button status
    const checkButtonStatus = () => {
        const isFieldValid = !!albumTitle.value.length;
        const albumCover = createAlbumModal.querySelector(`.inputFieldPicture`);
        const isCoverValid = albumCover && albumCover.src;
        if (isFieldValid && isCoverValid) createButton.removeAttribute(`disabled`);
        else createButton.setAttribute(`disabled`, `disabled`);
    };
    albumTitle.addEventListener(`input`, () => checkButtonStatus());
    // create button functions
    createButton.addEventListener(`click`, async (event) => {
        event.preventDefault();
        // fetch && change button
        setButtonStatus({ button: createButton, isLoaded: false });
        const formNode = createModal.querySelector(`.formWrapper`);
        const responseOptions = { method: `POST`, body: new FormData(formNode) };
        const response = await fetch(`/api/ideas/albums`, responseOptions);
        const responseData = await response.json();
        setButtonStatus({ button: createButton, isLoaded: true });
        if (responseData.code !== 200) return false; // need show error
        // hide modal && change album data on profile
        const albumCover = createAlbumModal.querySelector(`.inputFieldPicture`);
        const albumSource = albumCover.src;
        const albumName = albumTitle.value;
        // create new album && add it to list
        const albumList = document.querySelector(`.albumList`);
        const albumTemplate = document.querySelector(`.albumTemplate`).content;
        const albumClone = albumTemplate.querySelector(`li`).cloneNode(true);
        albumClone.querySelector(`.albumTitle`).innerText = albumName;
        albumClone.dataset.album = String(responseData.albumID);
        const templateCover = albumClone.querySelector(`.albumCoverPicture`);
        templateCover.src = albumSource;
        templateCover.setAttribute(`alt`, albumName);
        const albumModal = document.querySelector(`.createAlbumModal`);
        albumList.insertBefore(albumClone, albumList.children[albumList.children.length -1]);
        albumModal.classList.remove(`activeModal`);
        // clear modal
        albumTitle.value = ``;
        photoField.value = ``;
        coverWrapper.removeChild(albumCover);
        photoLabel.classList.remove(`editLabel`);
    });

};