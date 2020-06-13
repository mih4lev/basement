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
    const addedDropZone = document.querySelector(`.uploadPhotoWrapper`);
    const dropField = document.querySelector(`.photoDropField`);
    const uploadList = document.querySelector(`.uploadPhotosList`);
    const uploadTitle = document.querySelector(`.uploadTitleWrapper`);
    const uploadPhotoButton = addPhotoModal.querySelector(`.photoField`);
    const submitButton = addPhotoModal.querySelector(`.submitButton`);
    const titleField = uploadTitle.querySelector(`.fieldInput`);
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (event) => event.preventDefault();
    dropEvents.forEach((eventName) => {
        dropZone.addEventListener(eventName, removeBrowserAPI);
        addedDropZone.addEventListener(eventName, removeBrowserAPI);
    });
    const checkButtonStatus = () => {
        const isTitleValid = !!titleField.value.length;
        const isFilesValid = uploadList.children.length > 1;
        if (isTitleValid && isFilesValid) submitButton.removeAttribute(`disabled`);
        else submitButton.setAttribute(`disabled`, `disabled`);
    };
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
            checkButtonStatus();
            if (uploadList.children.length <= 1) {
                uploadList.classList.add(`hiddenList`);
                uploadTitle.classList.add(`hiddenTitle`);
                dropZone.classList.remove(`hiddenWrapper`);
            }
        });
        wrapper.appendChild(button);
        uploadList.appendChild(wrapper);
        checkButtonStatus();
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
    titleField.addEventListener(`input`, () => {
        checkButtonStatus();
    });
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
    // 
    addedDropZone.addEventListener(`dragenter`, () => {
        addedDropZone.classList.add(`dropOver`);
    });
    addedDropZone.addEventListener(`dragleave`, () => {
        addedDropZone.classList.remove(`dropOver`);
    });
    addedDropZone.addEventListener(`drop`, () => {
        addedDropZone.classList.remove(`dropOver`);
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
    });
    // button click upload
    dropField.addEventListener(`change`, () => {
        if (!dropField.files || !dropField.files.length) return false;
        showUploadFiles([...dropField.files]);
    });
    uploadPhotoButton.addEventListener(`change`, () => {
        if (!uploadPhotoButton.files || !uploadPhotoButton.files.length) return false;
        showUploadFiles([...uploadPhotoButton.files]);
    });
})();

// create album modal
// (function(){
//     const createAlbumModal = document.querySelector(`.createAlbumWrapper`);
//     const titleField = createAlbumModal.querySelector(`.fieldInput`);
//     const submitButton = createAlbumModal.querySelector(`.submitButton`);
//     const dropZone = createAlbumModal.querySelector(`.photoLabelEmpty`);
//     const addedDropZone = createAlbumModal.querySelector(`.inputFieldPicture`);
//     const photoField = createAlbumModal.querySelector(`.photoField`);
//     // remove default drag && drop browser API
//     const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
//     const removeBrowserAPI = (event) => event.preventDefault();
//     dropEvents.forEach((eventName) => {
//         dropZone.addEventListener(eventName, removeBrowserAPI);
//     });
//     // update image by drag & drop && unload
//     const showUploadFiles = (files) => {
//         files.forEach((file) => {
//             const reader = new FileReader();
//             reader.addEventListener(`load`, () => {
//                 addedDropZone.src = reader.result;
//                 addedDropZone.setAttribute(`alt`, file.name);
//                 checkButtonStatus();
//             });
//             reader.addEventListener(`error`, () => {
//                 console.log(`error`);
//             });
//             reader.readAsDataURL(file);
//         });
//     };
//     photoField.addEventListener(`change`, () => {
//         if (!photoField.files || !photoField.files.length) return false;
//         showUploadFiles([...photoField.files]);
//     });
//     dropZone.addEventListener(`drop`, () => {
//         if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
//         showUploadFiles([...event.dataTransfer.files]);
//     });
//     // check button status
//     const checkButtonStatus = () => {
//         const isFieldValid = !!titleField.value;
//         const isFilesValid = addedDropZone && addedDropZone.src;
//         if (isFieldValid && isFilesValid) submitButton.removeAttribute(`disabled`);
//         else submitButton.setAttribute(`disabled`, `disabled`);
//     };
//     titleField.addEventListener(`input`, () => checkButtonStatus());
// })();

// edit album modal 
(function(){
    const editAlbumModal = document.querySelector(`.editAlbumWrapper`);
    const photoField = document.querySelector(`.photoField`);
    const dropZone = editAlbumModal.querySelector(`.photoLabel`);
    const albumPhoto = editAlbumModal.querySelector(`.inputFieldPicture`);
    const updateButton = editAlbumModal.querySelector(`.submitButton`);
    const albumTitle = editAlbumModal.querySelector(`.fieldInput`);
    // remove default drag && drop browser API
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (event) => event.preventDefault();
    dropEvents.forEach((eventName) => {
        dropZone.addEventListener(eventName, removeBrowserAPI);
    });
    const checkButtonStatus = () => {
        const isTitleValid = !!albumTitle.value.length;
        const isFilesValid = albumPhoto && albumPhoto.src;
        if (isTitleValid && isFilesValid) updateButton.removeAttribute(`disabled`);
        else updateButton.setAttribute(`disabled`, `disabled`);
    };
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                albumPhoto.src = reader.result;
                albumPhoto.setAttribute(`alt`, file.name);
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
    dropZone.addEventListener(`drop`, () => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
    });
    albumTitle.addEventListener(`input`, () => {
        checkButtonStatus();
    });
})();

// edit profile modal
(function(){
    const editProfileModal = document.querySelector(`.editProfileWrapper`);
    const dropZone = editProfileModal.querySelector(`.photoLabel`);
    const photoField = editProfileModal.querySelector(`.photoField`);
    const photoNode = editProfileModal.querySelector(`.inputFieldPicture`);
    const textFields = [...editProfileModal.querySelectorAll(`.fieldInput`)];
    const updateButton = editProfileModal.querySelector(`.submitButton`);
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (event) => event.preventDefault();
    const showUploadFiles = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                photoNode.src = reader.result;
                photoNode.setAttribute(`alt`, file.name);
            });
            reader.addEventListener(`error`, () => {
                console.log(`error`);
            });
            reader.readAsDataURL(file);
        });
    };
    dropEvents.forEach((eventName) => {
        dropZone.addEventListener(eventName, removeBrowserAPI);
    });
    // update image by drag & drop && unload
    photoField.addEventListener(`change`, () => {
        if (!photoField.files || !photoField.files.length) return false;
        showUploadFiles([...photoField.files]);
    });
    dropZone.addEventListener(`drop`, () => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        showUploadFiles([...event.dataTransfer.files]);
    });
    // check button status
    const checkButtonStatus = () => {
        const filter = (field) => !!field.value;
        const isFieldsValid = textFields.filter(filter).length === textFields.length;
        const isFilesValid = photoNode && photoNode.src;
        if (isFieldsValid && isFilesValid) updateButton.removeAttribute(`disabled`);
        else updateButton.setAttribute(`disabled`, `disabled`);
    };
    textFields.forEach((field) => {
        field.addEventListener(`input`, () => checkButtonStatus());
    });
})();

headerMenu();