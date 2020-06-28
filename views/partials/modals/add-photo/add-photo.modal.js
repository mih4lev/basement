import { changeModalVisible, resetDropEvents, saveAction, setModal } from "../modals";

export const addPhotoModal = () => {

    const modalNode = setModal(`add-photo`);
    const formNode = modalNode.querySelector(`.formWrapper`);
    const formButton = modalNode.querySelector(`.submitButton`);
    const photosTitle = document.querySelector(`#ideaTitle`);
    const addButtons = [...document.querySelectorAll(`.addPhotoButton`)];
    const drop1 = document.querySelector(`.photoDropWrapper`);
    const drop3 = document.querySelector(`.ideaWrapper .addPhotoButton`);
    const drop2 = document.querySelector(`.uploadPhotoWrapper.addPhotoButton`);
    const uploadButtons = [...document.querySelectorAll(`.uploadField`)];
    const uploadList = document.querySelector(`.uploadPhotosList`);
    const uploadTitle = document.querySelector(`.uploadTitleWrapper`);
    const ideaList = document.querySelector(`.ideaList`);

    // customFiles
    const customFiles = {};

    const checkFiles = () => {
        let isExist = false;
        for (const file in customFiles) isExist = true;
        return isExist;
    }

    const checkButtonStatus = () => {
        const isFilesExist = checkFiles();
        const isTitleExist = !!photosTitle.value.length;
        formButton.disabled = !isFilesExist || !isTitleExist;
    };

    const hideDropContainer = () => {
        uploadList.classList.remove(`hiddenList`);
        uploadTitle.classList.remove(`hiddenTitle`);
        drop1.classList.add(`hiddenWrapper`);
    };

    const showDropContainer = () => {
        uploadList.classList.add(`hiddenList`);
        uploadTitle.classList.add(`hiddenTitle`);
        drop1.classList.remove(`hiddenWrapper`);
    };

    const createThumb = (generatedURL, fileName) => {
        const picture = document.createElement(`img`);
        picture.src = generatedURL;
        picture.classList.add(`uploadedPhoto`);
        picture.setAttribute(`alt`, fileName);
        return picture;
    }

    const createThumbWrapper = () => {
        const wrapper = document.createElement(`li`);
        wrapper.classList.add(`uploadPhotoWrapper`);
        return wrapper;
    };

    const createDeleteButton = () => {
        const button = document.createElement(`button`);
        button.classList.add(`removeButton`);
        button.setAttribute(`type`, `button`);
        button.innerText = `REMOVE PHOTO`;
        return button;
    };

    const createUploadPicture = (generatedURL, fileName) => {
        const thumbWrapper = createThumbWrapper();
        const thumbPicture = createThumb(generatedURL, fileName);
        const deleteButton = createDeleteButton();
        thumbWrapper.appendChild(thumbPicture);
        thumbWrapper.appendChild(deleteButton);
        const deleteHandler = () => {
            delete customFiles[fileName];
            uploadList.removeChild(thumbWrapper);
            if (uploadList.children.length <= 1) showDropContainer();
            checkButtonStatus();
        };
        deleteButton.addEventListener(`click`, deleteHandler);
        return thumbWrapper;
    };

    const updateCustomFiles = (files) => {
        [...files].forEach((file) => {
            customFiles[file.name] = file;
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                const uploadThumb = createUploadPicture(reader.result, file.name);
                uploadList.appendChild(uploadThumb);
                checkButtonStatus();
            });
            reader.readAsDataURL(file);
            hideDropContainer();
        });
    };

    // d&d actions | events
    if (drop1 && drop2 && drop3) resetDropEvents([drop1, drop2, drop3]);
    const dropHandler = ({ isChangeVisible = false } = {}) => {
        return (event) => {
            if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
            updateCustomFiles(event.dataTransfer.files);
            if (isChangeVisible) changeModalVisible(modalNode)();
        };
    };
    if (drop1) drop1.addEventListener(`drop`, dropHandler());
    if (drop2) drop2.addEventListener(`drop`, dropHandler());
    if (drop3) drop3.addEventListener(`drop`, dropHandler({ isChangeVisible: true }));

    // user default files upload
    uploadButtons.forEach((uploadButton) => {
        uploadButton.addEventListener(`change`, () => {
            updateCustomFiles(uploadButton.files);
            uploadButton.value = null;
        });
    });

    const clearModalData = () => {
        // clear customFiles
        for (const fileName in customFiles) delete customFiles[fileName];
        // clear thumb list
        [...uploadList.children].forEach((thumb) => {
            if (thumb.classList.contains(`addPhotoButton`)) return false;
            uploadList.removeChild(thumb);
        });
        // clear title
        photosTitle.value = ``;
        // show modal drop container
        showDropContainer();
        checkButtonStatus();
    };

    const createIdea = (generatedURL, title, ideaID) => {
        const ideaTemplate = document.querySelector(`.ideaTemplate`).content;
        const ideaClone = ideaTemplate.querySelector(`li`).cloneNode(true);
        const ideaPhoto = ideaClone.querySelector(`.ideaPhoto`);
        const ideaTitle = ideaClone.querySelector(`.ideaTitle`);
        ideaPhoto.src = generatedURL;
        ideaPhoto.dataset.idea = ideaID;
        ideaPhoto.setAttribute(`alt`, title);
        ideaTitle.innerText = title;
        ideaList.appendChild(ideaClone);
        ideaList.insertBefore(ideaClone, ideaList.children[1]);
    }

    const saveIdeas = (title, addedIDArray) => {
        let arrayIndex = 0;
        for (const fileName in customFiles) {
            const ideaID = addedIDArray[arrayIndex] || 10; // delete defaultID
            const reader = new FileReader();
            reader.addEventListener(`load`, () => {
                createIdea(reader.result, title, ideaID);
            });
            reader.readAsDataURL(customFiles[fileName]);
            arrayIndex += 1;
        }
    };

    const sendData = async (event) => {
        event.preventDefault();
        const formData = new FormData(formNode);
        for (const fileName in customFiles) {
            formData.append(`ideaPhotos`, customFiles[fileName], fileName);
        }
        // change button && fetch data
        const responseOptions = { URL: `/api/ideas`, body: formData, button: event.target };
        const responseData = await saveAction(responseOptions);
        if (responseData.code !== 200) return false; // show error
        const addedIDArray = [ 286, 287, 288, 289, 290 ]; // update to response added id
        saveIdeas(photosTitle.value, addedIDArray);
        changeModalVisible(modalNode)();
        clearModalData();
    };

    // title change
    photosTitle.addEventListener(`input`, checkButtonStatus);

    // form button handler
    formButton.addEventListener(`click`, sendData);

    // show modal on click buttons
    addButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible(modalNode));
    });

};