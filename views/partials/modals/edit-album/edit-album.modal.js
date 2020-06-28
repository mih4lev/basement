import {setButtonStatus} from "../modals";

export const editAlbumModal = () => {

    const editButtons = [...document.querySelectorAll(`.editAlbumButton`)];
    const editAlbumModal = document.querySelector(`.editAlbumModal`);
    const closeModalButton = editAlbumModal.querySelector(`.closeButton`);
    const albumList = document.querySelector(`.albumList`);
    const changeModalVisible = ({ target: editButton }) => {
        editAlbumModal.dataset.album = editButton.parentNode.dataset.album;
        const isModalActive = editAlbumModal.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        editAlbumModal.classList[modalClassAction](`activeModal`);
        // add data from profile to modal
        if (!isModalActive) {
            const albumWrapper = editButton.closest(`.albumWrapper`);
            const albumCover = albumWrapper.querySelector(`.albumCoverPicture`).src;
            const albumTitle = albumWrapper.querySelector(`.albumTitle`).innerText;
            const albumID = albumWrapper.dataset.album;
            // set data to
            editAlbumModal.querySelector(`#editAlbumTitle`).value = albumTitle;
            editAlbumModal.querySelector(`#editAlbumID`).value = albumID;
            editAlbumModal.querySelector(`.inputFieldPicture`).src = albumCover;
        }
    };
    editButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
    // add mutationObserver for new albums add
    const observerOptions = { attributes: true, childList: true, subtree: true };
    const observerCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
            if (!mutation.addedNodes[0]) return false;
            if (mutation.addedNodes[0].tagName !== `LI`) return false;
            const editButton = mutation.addedNodes[0].querySelector(`.editAlbumButton`);
            editButton.addEventListener(`click`, changeModalVisible);
        });
    };
    const observer = new MutationObserver(observerCallback);
    if (albumList) observer.observe(albumList, observerOptions);

    const photoField = editAlbumModal.querySelector(`.photoField`);
    const dropZone = editAlbumModal.querySelector(`.photoLabel`);
    const albumCover = editAlbumModal.querySelector(`.inputFieldPicture`);
    const albumTitle = editAlbumModal.querySelector(`.fieldInput`);
    const updateButton = editAlbumModal.querySelector(`.submitButton`);
    const deleteButton = editAlbumModal.querySelector(`.deleteButton`);
    // remove default drag && drop browser API
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (event) => event.preventDefault();
    dropEvents.forEach((eventName) => {
        dropZone.addEventListener(eventName, removeBrowserAPI);
    });
    const checkButtonStatus = () => {
        const isTitleValid = !!albumTitle.value.length;
        const isFilesValid = albumCover && albumCover.src;
        if (isTitleValid && isFilesValid) updateButton.removeAttribute(`disabled`);
        else updateButton.setAttribute(`disabled`, `disabled`);
    };
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                albumCover.src = reader.result;
                albumCover.setAttribute(`alt`, file.name);
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
    dropZone.addEventListener(`drop`, (event) => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
    });
    albumTitle.addEventListener(`input`, () => {
        checkButtonStatus();
    });
    // delete func
    const deleteHandler = async (event) => {
        event.preventDefault();
        const albumID = editAlbumModal.dataset.album;
        // fetch && change button
        setButtonStatus({ button: deleteButton, isLoaded: false });
        const requestData = { albumID };
        const responseOptions = {
            method: `DELETE`,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        };
        const response = await fetch(`/api/ideas/albums`, responseOptions);
        const responseData = await response.json();
        setButtonStatus({ button: deleteButton, isLoaded: true });
        if (responseData.code !== 200) return false; // need show error
        // hide edit modal && change album data
        albumList.removeChild(albumList.querySelector(`[data-album="${albumID}"]`));
        editAlbumModal.classList.remove(`activeModal`);
    };
    deleteButton.addEventListener(`click`, deleteHandler);
    // edit func
    const updateHandler = async (event) => {
        event.preventDefault();
        const albumID = editAlbumModal.dataset.album;
        // fetch && change button
        setButtonStatus({ button: updateButton, isLoaded: false });
        const formNode = editAlbumModal.querySelector(`.formWrapper`);
        const responseOptions = { method: `PUT`, body: new FormData(formNode) };
        const response = await fetch(`/api/ideas/albums`, responseOptions);
        const responseData = await response.json();
        setButtonStatus({ button: updateButton, isLoaded: true });
        if (responseData.code !== 200) return false; // need show error
        // hide modal && change album data on profile
        const albumNode = albumList.querySelector(`[data-album="${albumID}"]`);
        albumNode.querySelector(`.albumTitle`).innerText = albumTitle.value;
        albumNode.querySelector(`.albumCoverPicture`).src = albumCover.src;
        editAlbumModal.classList.remove(`activeModal`);
    };
    updateButton.addEventListener(`click`, updateHandler);

};