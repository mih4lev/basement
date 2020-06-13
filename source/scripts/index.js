import { headerMenu } from "../../views/partials/header/header";

// webp checker
(function(){
    const canvas = document.createElement(`canvas`);
    let canUseWebp = false;
    if (!!(canvas.getContext && canvas.getContext(`2d`))) {
        canUseWebp = canvas.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0;
    }
    const htmlNode = document.querySelector(`html`);
    const webpClass = (canUseWebp) ? `webp` : `no-webp`;
    htmlNode.classList.add(webpClass);
})();

// temp func for title width
(function(){
    const titleNode = document.querySelector(`title`);
    const checkWidth = () => titleNode.innerText = `DEV ${window.innerWidth}`;
    window.addEventListener(`resize`, checkWidth);
    checkWidth();
})();

// ideas modal show
(function(){
    const ideaPhotos = [...document.querySelectorAll(`.ideaPhoto`)];
    const modalWindow = document.querySelector(`.viewModalSection`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    ideaPhotos.forEach((photo) => {
        photo.addEventListener(`click`, changeModalVisible);
    });
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// login button modal show
(function(){
    const loginButtons = [...document.querySelectorAll(`.userLogin`)];
    const modalWindow = document.querySelector(`.signInModal`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    loginButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// edit profile modal show
(function(){
    const editButtons = [...document.querySelectorAll(`.editProfileButton`)];
    const modalWindow = document.querySelector(`.editProfileModal`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    editButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// create album modal show
(function(){
    const createButtons = [...document.querySelectorAll(`.createAlbumButton`)];
    const modalWindow = document.querySelector(`.createAlbumModal`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    createButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// edit album modal show
(function(){
    const editButtons = [...document.querySelectorAll(`.editAlbumButton`)];
    const modalWindow = document.querySelector(`.editAlbumModal`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    editButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// add photo modal show
(function(){
    const addButtons = [...document.querySelectorAll(`.addPhotoButton`)];
    const modalWindow = document.querySelector(`.addPhotoModal`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    addButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// delete card hover show
(function(){
    const deleteCardButtons = [...document.querySelectorAll(`.deleteCardButton`)];
    deleteCardButtons.forEach((deleteCardButton) => {
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
        deleteCardButton.addEventListener(`click`, changeHoverVisible);
        closeButton.addEventListener(`click`, changeHoverVisible);
        deleteButton.addEventListener(`click`, () => {
            const parentWrapper = deleteButton.closest(`.ideaWrapper`);
            parentWrapper.parentNode.removeChild(parentWrapper);
        });
    });
})();

// add contact us modal show
(function(){
    const addButtons = [...document.querySelectorAll(`.contactButton`)];
    const modalWindow = document.querySelector(`.contactUsModal`);
    const closeModalButton = modalWindow.querySelector(`.closeButton`);
    const changeModalVisible = () => {
        const isModalActive = modalWindow.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalWindow.classList[modalClassAction](`activeModal`);
    };
    addButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible);
    })
    closeModalButton.addEventListener(`click`, changeModalVisible);
})();

// how it works => our process | show steps
(function(){
    const processList = [...document.querySelectorAll(`.processList .processItem`)];
    processList.forEach((process, index) => {
        const processButton = process.querySelector(`.activeProcessButton`);
        if (!processButton) return false;
        processButton.addEventListener(`click`, () => {
            const nextProcess = process.nextElementSibling;
            nextProcess.classList.remove(`processHidden`);
            processButton.classList.replace(`activeProcessButton`, `processButton`);
        });
    });
})();

// drop zone album pictures wrapper
(function(){
    const addPhotoModal = document.querySelector(`.addPhotoModal`);
    const dropZone = document.querySelector(`.photoDropWrapper`);
    const dropField = document.querySelector(`.photoDropField`);
    const uploadList = document.querySelector(`.uploadPhotosList`);
    const uploadTitle = document.querySelector(`.uploadTitleWrapper`);
    const uploadPhotoButton = addPhotoModal.querySelector(`.photoField`);
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (event) => event.preventDefault();
    dropEvents.forEach((eventName) => dropZone.addEventListener(eventName, removeBrowserAPI));
    const createUploadPicture = (URL, title) => {
        const wrapper = document.createElement(`li`);
        wrapper.classList.add(`uploadPhotoWrapper`);
        const picture = document.createElement(`img`);
        picture.src = URL;
        picture.classList.add(`uploadedPhoto`);
        picture.setAttribute(`alt`, title);
        wrapper.appendChild(picture);
        const button = document.createElement(`button`);
        button.classList.add(`removeButton`);
        button.setAttribute(`type`, `button`);
        button.innerText = `REMOVE PHOTO`;
        button.addEventListener(`click`, () => {
            uploadList.removeChild(wrapper);
        });
        wrapper.appendChild(button);
        uploadList.appendChild(wrapper);
    };
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                createUploadPicture(reader.result, file.name);
            });
            reader.addEventListener(`error`, () => {
                console.log(`error`);
            });
            reader.readAsDataURL(file);
            uploadList.classList.remove(`hiddenList`);
            uploadTitle.classList.remove(`hiddenTitle`);
            dropZone.classList.add(`hiddenWrapper`);
        });
    };
    dropZone.addEventListener(`dragenter`, () => {
        dropZone.classList.add(`dropOver`);
    });
    dropZone.addEventListener(`dragleave`, () => {
        dropZone.classList.remove(`dropOver`);
    });
    dropZone.addEventListener(`drop`, (event) => {
        dropZone.classList.remove(`dropOver`);
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
    });
    dropField.addEventListener(`change`, () => {
        if (!dropField.files || !dropField.files.length) return false;
        showUploadFiles([...dropField.files]);
    });
    uploadPhotoButton.addEventListener(`change`, () => {
        if (!uploadPhotoButton.files || !uploadPhotoButton.files.length) return false;
        showUploadFiles([...uploadPhotoButton.files]);
    });
})();

headerMenu();