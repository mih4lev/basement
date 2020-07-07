import {changeModalVisible, resetDropEvents, saveAction, setModal} from "../modals";

export const editAlbumModal = () => {

    const modalNode = setModal(`edit-album`);

    const modalPhotoField = modalNode.querySelector(`.photoField`);
    const dropZone = modalNode.querySelector(`.photoLabel`);
    const modalAlbumCover = modalNode.querySelector(`.inputFieldPicture`);
    const modalAlbumTitle = modalNode.querySelector(`.fieldInput`);
    const updateButton = modalNode.querySelector(`.submitButton`);
    const deleteButton = modalNode.querySelector(`.deleteButton`);

    const editButtons = [...document.querySelectorAll(`.editAlbumButton`)];
    const albumList = document.querySelector(`.albumList`);

    // change edit modal data from clicked element
    const changeModalData = ({ target: editButton }) => {
        // data from page
        const albumWrapper = editButton.closest(`.albumWrapper`);
        const albumCover = albumWrapper.querySelector(`.albumCoverPicture`).src;
        const albumTitle = albumWrapper.querySelector(`.albumTitle`).innerText;
        // set album id to wrapper
        const albumID = albumWrapper.dataset.album;
        modalNode.dataset.album = albumID;
        // set data to modal
        modalNode.querySelector(`#editAlbumTitle`).value = albumTitle;
        modalNode.querySelector(`#editAlbumID`).value = albumID;
        modalNode.querySelector(`.inputFieldPicture`).src = albumCover;
    };

    // add listeners to edit buttons
    editButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalData);
        button.addEventListener(`click`, changeModalVisible(modalNode));
    });

    // check update button status
    const checkButtonStatus = () => {
        const isTitleValid = !!modalAlbumTitle.value.length;
        const isFilesValid = modalAlbumCover && modalAlbumCover.src;
        if (isTitleValid && isFilesValid) updateButton.removeAttribute(`disabled`);
        else updateButton.setAttribute(`disabled`, `disabled`);
    };

    // show upload || drop files
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                modalAlbumCover.src = reader.result;
                modalAlbumCover.setAttribute(`alt`, file.name);
                checkButtonStatus();
            });
            reader.readAsDataURL(file);
        });
    };

    // request data from API
    const requestData = async (method, button) => {
        const formNode = modalNode.querySelector(`.formWrapper`);
        const formData = new FormData(formNode);
        const URL = `/api/profile/albums`;
        const responseOptions = { URL, method, body: formData, button };
        return await saveAction(responseOptions);
    };

    // delete func
    const deleteHandler = async (event) => {
        event.preventDefault();
        const responseData = await requestData(`DELETE`, deleteButton);
        if (responseData.code !== 200) return false; // show error
        // hide edit modal && change album data
        const albumID = modalNode.dataset.album;
        albumList.removeChild(albumList.querySelector(`[data-album="${albumID}"]`));
        modalNode.classList.remove(`activeModal`);
    };

    // edit func
    const updateHandler = async (event) => {
        event.preventDefault();
        const responseData = await requestData(`PUT`, updateButton);
        if (responseData.code !== 200) return false; // show error
        // hide modal && change album data on profile
        const albumID = modalNode.dataset.album;
        const albumNode = albumList.querySelector(`[data-album="${albumID}"]`);
        const albumTitle = albumNode.querySelector(`.albumTitle`);
        const albumCover = albumNode.querySelector(`.albumCoverPicture`);
        albumTitle.innerText = modalAlbumTitle.value;
        albumCover.src = modalAlbumCover.src;
        // hide modal
        changeModalVisible(modalNode)();
    };

    // upload photo handler
    const changeHandler = () => {
        if (!modalPhotoField.files || !modalPhotoField.files.length) return false;
        showUploadFiles([...modalPhotoField.files]);
    };

    // d&d photo handler
    const dropHandler = (event) => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
    };

    // d&d events
    if (dropZone) resetDropEvents([dropZone]);
    dropZone.addEventListener(`drop`, dropHandler);

    modalPhotoField.addEventListener(`change`, changeHandler);
    modalAlbumTitle.addEventListener(`input`, () => checkButtonStatus());

    // modal buttons handler
    deleteButton.addEventListener(`click`, deleteHandler);
    updateButton.addEventListener(`click`, updateHandler);

    // add mutationObserver for new albums add
    const observerOptions = { attributes: true, childList: true, subtree: true };
    const observerCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
            if (!mutation.addedNodes[0]) return false;
            if (mutation.addedNodes[0].tagName !== `LI`) return false;
            const editButton = mutation.addedNodes[0].querySelector(`.editAlbumButton`);
            editButton.addEventListener(`click`, changeModalData);
            editButton.addEventListener(`click`, changeModalVisible(modalNode));
        });
    };

    const observer = new MutationObserver(observerCallback);
    if (albumList) observer.observe(albumList, observerOptions);

};