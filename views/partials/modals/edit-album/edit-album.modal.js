import { changeModalVisible, setModal } from "../modals";
import { resetDropEvents, saveAction } from "../../../../source/scripts/utils";

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
        const albumCoverNode = albumWrapper.querySelector(`.albumCoverPicture`);
        const albumTitle = albumWrapper.querySelector(`.albumTitle`).innerText;
        // set album id to wrapper
        const albumID = albumWrapper.dataset.album;
        modalNode.dataset.album = albumID;
        // set data to modal
        modalNode.querySelector(`#editAlbumTitle`).value = albumTitle;
        modalNode.querySelector(`#editAlbumID`).value = albumID;
        const coverNode = modalNode.querySelector(`.inputFieldPicture`);
        if (albumCoverNode.src) coverNode.src = albumCoverNode.src;
        // if (albumCoverNode.src) {
        //     coverNode.src = albumCoverNode.src;
        // } else {
        //     const albumField = coverNode.closest(`.albumField`);
        //     albumField.removeChild(coverNode);
        //     const defaultNode = document.createElement(`div`);
        //     defaultNode.classList.add(`inputFieldPicture`);
        //     albumField.appendChild(defaultNode);
        // }
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
        formData.delete(`albumCover`);
        const URL = `/api/profile/albums`;
        const responseOptions = { URL, method, body: formData, button };
        return await saveAction(responseOptions);
    };

    // delete func
    const deleteHandler = async (event) => {
        event.preventDefault();
        const responseData = await requestData(`DELETE`, deleteButton);
        if (responseData.status !== 1) return false; // show error
        // hide edit modal && change album data
        location.reload();
        const albumID = modalNode.dataset.album;
        albumList.removeChild(albumList.querySelector(`[data-album="${albumID}"]`));
        modalNode.classList.remove(`activeModal`);
        // change add button style if last deleted
        const albums = [...document.querySelectorAll(`.albumWrapper[data-album]`)];
        if (!albums.length) {
            const addButton = document.querySelector(`.albumAddCover`);
            addButton.classList.remove(`alreadyAdded`);
        }
    };

    // edit func
    const updateHandler = async (event) => {
        event.preventDefault();
        const formNode = modalNode.querySelector(`.formWrapper`);
        const formData = new FormData(formNode);
        const responseOptions = { URL: `/api/profile/albums/edit`, body: formData, button: updateButton };
        const responseData = await saveAction(responseOptions);
        if (responseData.status !== 1) return false; // show error
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