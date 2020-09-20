import { changeModalVisible, setModal } from "../modals";
import { resetDropEvents, saveAction } from "../../../../source/scripts/utils";

export const createAlbumModal = () => {

    const albumList = document.querySelector(`.albumList`);
    const createButtons = [...document.querySelectorAll(`.createAlbumButton`)];
    // set modal
    const modalNode = setModal(`create-album`);
    const formNode = modalNode.querySelector(`.formWrapper`);
    // edit modal data
    const modalPhotoField = modalNode.querySelector(`.photoField`);
    const modalDropZone = modalNode.querySelector(`.photoLabel`);
    const modalCoverWrapper = modalNode.querySelector(`.albumField`);
    const modalAlbumTitle = modalNode.querySelector(`.fieldInput`);
    const modalCreateButton = modalNode.querySelector(`.submitButton`);

    // show upload files
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                const coverNode = document.createElement(`img`);
                coverNode.src = reader.result;
                coverNode.classList.add(`inputFieldPicture`);
                coverNode.setAttribute(`alt`, file.name);
                modalCoverWrapper.appendChild(coverNode);
                modalDropZone.classList.add(`editLabel`);
                checkButtonStatus();
            });
            reader.readAsDataURL(file);
        });
    };

    // change handler
    const changeHandler = () => {
        if (!modalPhotoField.files || !modalPhotoField.files.length) return false;
        showUploadFiles([...modalPhotoField.files]);
    }
    if (modalPhotoField) modalPhotoField.addEventListener(`change`, changeHandler);

    // remove default drag && drop browser API
    const dropHandler = (event) => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
        modalDropZone.classList.remove(`dropOver`);
    };
    if (modalDropZone) resetDropEvents([modalDropZone]);
    if (modalDropZone) modalDropZone.addEventListener(`drop`, dropHandler);

    // create album
    const createAlbumNode = (albumCover, responseData) => {
        const albumSource = albumCover.src;
        const albumName = modalAlbumTitle.value;
        // create new album && add it to list
        const albumTemplate = document.querySelector(`.albumTemplate`).content;
        const albumClone = albumTemplate.querySelector(`li`).cloneNode(true);
        albumClone.querySelector(`.albumTitle`).innerText = albumName;
        albumClone.dataset.album = String(responseData.requestID);
        const templateCover = albumClone.querySelector(`.albumCoverPicture`);
        templateCover.src = albumSource;
        templateCover.setAttribute(`alt`, albumName);
        const albumLink = albumClone.querySelector(`.albumLink`);
        albumLink.setAttribute(`href`, `profile/saved/${responseData.requestID}`);
        albumList.insertBefore(albumClone, albumList.children[albumList.children.length -1]);
    }

    // clear data on save
    const clearModalData = (albumCover) => {
        modalAlbumTitle.value = ``;
        modalPhotoField.value = ``;
        modalCoverWrapper.removeChild(albumCover);
        modalDropZone.classList.remove(`editLabel`);
    };

    // check button status
    const checkButtonStatus = () => {
        const isFieldValid = !!modalAlbumTitle.value.length;
        const albumCover = modalNode.querySelector(`.inputFieldPicture`);
        const isCoverValid = albumCover && albumCover.src;
        if (isFieldValid && isCoverValid) modalCreateButton.removeAttribute(`disabled`);
        else modalCreateButton.setAttribute(`disabled`, `disabled`);
    };

    // create album
    const createAlbum = async (event) => {
        event.preventDefault();
        const formData = new FormData(formNode);
        const responseOptions = { URL: `/api/profile/albums`, body: formData, button: modalCreateButton };
        const responseData = await saveAction(responseOptions);
        if (responseData.status !== 1) return false; // show error
        // hide modal && change album data on profile
        const albumCover = modalNode.querySelector(`.inputFieldPicture`);
        createAlbumNode(albumCover, responseData);
        changeModalVisible(modalNode)();
        const addButton = document.querySelector(`.albumAddCover`);
        addButton.classList.add(`alreadyAdded`);
        // clear modal
        clearModalData(albumCover);
    }

    // add listeners to show modal
    createButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible(modalNode));
    })

    // check title length && button status
    modalAlbumTitle.addEventListener(`input`, () => checkButtonStatus());

    // create button functions
    modalCreateButton.addEventListener(`click`, createAlbum);

};