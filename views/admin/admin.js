import { loader, requestData, saveAction } from "../../source/scripts/utils";

require('fslightbox');

const formNode = document.querySelector(`.formNode`);
const formButton = document.querySelector(`.submitButton`);
// left menu
const menuButtons = [...document.querySelectorAll(`.menuLink`)];
menuButtons.forEach((button) => {
    const buttonWrapper = button.closest(`.menuWrapper`);
    button.addEventListener(`click`, () => {
        const isActive = buttonWrapper.classList.contains(`activeMenu`);
        const classAction = (isActive) ? `remove` : `add`;
        buttonWrapper.classList[classAction](`activeMenu`);
    });
    // check for active menu && show them
    const isExistActive = !![...buttonWrapper.querySelectorAll(`.activeLink`)].length;
    if (isExistActive) buttonWrapper.classList.add(`activeMenu`);
});

// fields
const fields = [...document.querySelectorAll(`input[type="text"], textarea`)];
fields.forEach((field) => {
    const fieldWrapper = field.closest(`.fieldWrapper`);
    if (!fieldWrapper) return false;
    const fieldTitle = fieldWrapper.querySelector(`label`);
    const changeTitle = () => {
        const isEmpty = !field.value.length;
        const isHidden = fieldTitle.classList.contains(`hiddenLabel`);
        const classAction = (isHidden && isEmpty) ? `remove` : `add`;
        fieldTitle.classList[classAction](`hiddenLabel`);
    };
    field.addEventListener(`focus`, changeTitle);
    field.addEventListener(`blur`, changeTitle);
    if (field.value.length) changeTitle();
});

// image fields

const createUploadPicture = (generatedURL, fileName) => {
    const imageNode = document.createElement(`img`);
    imageNode.classList.add(`fieldPreview`);
    imageNode.src = generatedURL;
    imageNode.setAttribute(`alt`, fileName);
    return imageNode;
};

const updateCustomFiles = (files, fieldWrapper) => {
    const previewButton = fieldWrapper.querySelector(`.previewButton`);
    [...files].forEach((file) => {
        const reader = new FileReader();
        reader.addEventListener(`load`, () => {
            const uploadThumb = createUploadPicture(reader.result, file.name);
            fieldWrapper.appendChild(uploadThumb);
            // show button
            if (!previewButton) return false;
            previewButton.classList.remove(`hiddenButton`);
            previewButton.setAttribute(`href`, String(reader.result));
            refreshFsLightbox();
        });
        // delete previous preview if exist
        const previewImage = fieldWrapper.querySelector(`.fieldPreview`);
        if (previewImage) fieldWrapper.removeChild(previewImage);
        reader.readAsDataURL(file);
    });
};

const fileFields = [...document.querySelectorAll(`input[type="file"]`)];
fileFields.forEach((field) => {
    const fieldWrapper = field.closest(`.fileWrapper`);
    if (!fieldWrapper) return false;
    field.addEventListener(`change`, () => {
        updateCustomFiles(field.files, fieldWrapper);
    });
});

const parseCustomEditors = (formData) => {
    const customFields = [...document.querySelectorAll(`.tinyField`)];
    customFields.forEach((field) => {
        if (!tinymce) return false;
        const value = tinymce.get(field.id).getContent();
        formData.set(field.id, value);
    });
};

const collectFiles = (formData) => {
    const collectNode = document.querySelector(`.collectData`);
    if (!collectNode) return false;
    const fileNodes = [...collectNode.querySelectorAll(`.createdWrapper`)];
    fileNodes.forEach((wrapper, index) => {
        const { file, dataset: { name }} = wrapper;
        if (!file) return false;
        formData.append(name, file);
        // set data for possible if hasn't uploaded image
        if (wrapper.classList.contains(`workImage`)) formData.append(`possibleImage`, index);
    });
};

// submit button
const sendData = async (event) => {
    event.preventDefault();
    const { action: URL } = formNode;
    const { dataset: { action, redirect }} = formButton;
    const formData = new FormData(formNode);
    parseCustomEditors(formData);
    collectFiles(formData);
    const response = await saveAction({ URL, body: formData, button: formButton });
    const { status, requestID } = response;
    document.dispatchEvent(new CustomEvent(`successSave`, { detail: { response }}));
    if (status && action === `create`) location.href = `${redirect}/edit/${requestID}`;
    // if (status && action === `update`) location.reload();
};
if (formButton) formButton.addEventListener(`click`, sendData);
if (formNode) formNode.addEventListener(`submit`, sendData);

// delete buttons
const deleteButtons = [...document.querySelectorAll(`.deleteButton`)];
deleteButtons.forEach((button) => {
    const { dataset: { action: URL, redirect }} = button;
    const buttonsWrapper = button.parentNode.querySelector(`.buttonHiddenWrapper`);
    const cancelButton = buttonsWrapper.querySelector(`.cancelButton`);
    const confirmButton = buttonsWrapper.querySelector(`.confirmButton`);
    const changeVisible = () => {
        const isActive = (!buttonsWrapper.classList.contains(`hiddenWrapper`));
        const classAction = (isActive) ? `add` : `remove`;
        buttonsWrapper.classList[classAction](`hiddenWrapper`);
    };
    button.addEventListener(`click`, changeVisible);
    cancelButton.addEventListener(`click`, changeVisible);
    confirmButton.addEventListener(`click`, async () => {
        changeVisible();
        const { status } = await saveAction({ URL, method: `DELETE`, button });
        if (status) location.href = redirect;
    });
});

// upload picture buttons
const uploadButtons = [...document.querySelectorAll(`.uploadButton`)];
uploadButtons.forEach((button) => {
    const uploadForm = button.parentNode.querySelector(`.uploadForm`);
    const uploadField = uploadForm.querySelector(`.uploadField`);
    const uploadPreview = uploadForm.querySelector(`.uploadPreview`);
    const sendButton = uploadForm.querySelector(`.sendButton`);
    const uploadFieldWrapper = uploadForm.querySelector(`.uploadFieldWrapper`);
    //
    const selectWrapper = uploadForm.querySelector(`.selectWrapper`);
    const wrapperTitle = uploadForm.querySelector(`.wrapperTitle`);
    const widthField = selectWrapper.querySelector(`.imageWidth`);
    const heightField = selectWrapper.querySelector(`.imageHeight`);
    //
    const responseWrapper = uploadForm.querySelector(`.responseWrapper`);
    const errorWrapper = uploadForm.querySelector(`.errorWrapper`);
    const showError = () => {
        selectWrapper.classList.add(`hiddenWrapper`);
        errorWrapper.classList.remove(`hiddenWrapper`);
        uploadFieldWrapper.classList.add(`hiddenWrapper`);
        uploadForm.classList.add(`errorForm`);
        setTimeout(changeFormVisible, 0);
    };
    const resetForm = () => {
        uploadForm.classList.remove(`successForm`);
        uploadForm.classList.remove(`errorForm`);
        uploadFieldWrapper.classList.remove(`hiddenWrapper`);
        wrapperTitle.classList.remove(`hiddenTitle`);
        selectWrapper.classList.add(`hiddenWrapper`);
        responseWrapper.classList.add(`hiddenWrapper`);
        uploadPreview.classList.add(`hiddenPreview`);
        uploadField.value = ``;
    };
    const changeFormVisible = () => {
        const isVisible = (uploadForm.classList.contains(`hiddenForm`));
        if (isVisible) resetForm();
        const visibleAction = (isVisible) ? `remove` : `add`;
        uploadForm.classList[visibleAction](`hiddenForm`);
    };
    const selectImage = () => {
        const reader = new FileReader();
        const readerLoadHandler = () => {
            const image = new Image();
            image.src = String(reader.result);
            const imageLoadHandler = () => {
                widthField.value = image.width;
                heightField.value = image.height;
                uploadPreview.src = reader.result;
                uploadPreview.classList.remove(`hiddenPreview`);
                selectWrapper.classList.remove(`hiddenWrapper`);
                wrapperTitle.classList.add(`hiddenTitle`);
            };
            image.addEventListener(`load`, imageLoadHandler);
        };
        reader.addEventListener(`load`, readerLoadHandler);
        if (uploadField.files[0]) reader.readAsDataURL(uploadField.files[0]);
    }
    const sendData = async () => {
        const formData = new FormData();
        const fields = document.querySelectorAll(`[data-upload]`);
        const addData = (field) => {
            const { dataset: { upload }, type, value, files } = field;
            const data = (type === `file`) ? files[0] : value;
            formData.append(upload, data);
        };
        fields.forEach(addData);
        const URL = `/admin/upload`;
        const response = await saveAction({ URL, body: formData, button: sendButton });
        if (response.status === 0) return showError();
        selectWrapper.classList.add(`hiddenWrapper`);
        responseWrapper.classList.remove(`hiddenWrapper`);
        uploadFieldWrapper.classList.add(`hiddenWrapper`);
        uploadForm.classList.add(`successForm`);
        await navigator.clipboard.writeText(response.link);
        setTimeout(changeFormVisible, 0);
    }
    uploadField.addEventListener(`change`, selectImage);
    button.addEventListener(`click`, changeFormVisible);
    sendButton.addEventListener(`click`, sendData);
});

// stars rating
const ratingWrappers = [...document.querySelectorAll(`.starsWrapper`)];
ratingWrappers.forEach((starWrapper) => {
    const stars = starWrapper.querySelector(`.stars`);
    const starsField = starWrapper.parentNode.querySelector(`.hiddenField`);
    starWrapper.addEventListener(`click`, (event) => {
        const preRating = Math.ceil(event.offsetX / 21);
        const rating = (preRating >= 5) ? 5 : (preRating <= 0) ? 0 : preRating;
        stars.dataset.rating = rating;
        starsField.value = rating;
    });
});

// select author dropdown
const selects = [...document.querySelectorAll(`.currentSelect`)];
selects.forEach((authorSelect) => {
    const wrapper = authorSelect.closest(`.selectWrapper`);
    const field = wrapper.querySelector(`.hiddenField`);
    const currentSelect = wrapper.querySelector(`.currentSelect`);
    const dropdownWrapper = wrapper.querySelector(`.dropdownWrapper`);
    const changeDropdownVisible = () => {
        const dropdownVisible = !dropdownWrapper.classList.contains(`hiddenWrapper`);
        const visibleAction = (dropdownVisible) ? `add` : `remove`;
        dropdownWrapper.classList[visibleAction](`hiddenWrapper`);
    };
    authorSelect.addEventListener(`click`, changeDropdownVisible);
    const selectElements = [...wrapper.querySelectorAll(`.selectElement`)];
    const selectData = (element) => {
        const { dataset: { request: requestID }} = element;
        const dropdownElement = element.closest(`.dropdownElement`);
        const parentNode = element.parentNode;
        const editButton = element.parentNode.querySelector(`.editButton`);
        const editWrapper = dropdownElement.querySelector(`.editWrapper`);
        const editField = editWrapper.querySelector(`.editField`);
        const saveButton = editWrapper.querySelector(`.saveButton`);
        const removeElement = () => dropdownWrapper.removeChild(dropdownElement);
        const changeVisible = (isVisible = false) => {
            return () => {
                const classAction = (isVisible) => (isVisible) ? `remove` : `add`;
                parentNode.classList[classAction(!isVisible)](`hiddenWrapper`);
                editWrapper.classList[classAction(isVisible)](`hiddenWrapper`);
            };
        };
        const selectCurrentData = () => {
            const { dataset: { request: requestID }} = element;
            currentSelect.innerText = element.innerText;
            field.value = requestID;
            changeDropdownVisible();
        };
        const updateData = async () => {
            const { dataset: { api: URL }} = saveButton;
            const { dataset: { id: fieldID, name: fieldName }} = wrapper;
            const formData = new FormData();
            formData.append(fieldID, requestID);
            formData.append(fieldName, editField.value);
            const { status = 0 } = await saveAction({ URL, body: formData, button: saveButton });
            if (status === 0) return false;
            // save changes to BD
            if (!editField.value) {
                if (requestID === field.value) {
                    currentSelect.innerText = ``;
                    field.value = 0;
                }
                return removeElement();
            }
            element.innerText = editField.value;
            if (requestID === field.value) currentSelect.innerText = editField.value;
            changeVisible(false)();
        };
        element.addEventListener(`click`, selectCurrentData);
        editButton.addEventListener(`click`, changeVisible(true));
        saveButton.addEventListener(`click`, updateData);
    };
    selectElements.forEach(selectData);
    const newWrapper = wrapper.querySelector(`.newElement`);
    const createButton = wrapper.querySelector(`.createWrapper`);
    const addButton = newWrapper.querySelector(`.saveButton`);
    const editWrapper = newWrapper.querySelector(`.editWrapper`);
    const createField = editWrapper.querySelector(`.editField`);
    const changeAddVisible = () => {
        // show input field
        editWrapper.classList.remove(`hiddenWrapper`);
        createButton.classList.add(`hiddenWrapper`);
        //
        createField.focus();
    };
    const saveData = async () => {
        const { dataset: { api: URL }} = addButton;
        const formData = new FormData();
        const { dataset: { name: fieldName }} = wrapper;
        formData.append(fieldName, createField.value);
        const responseData = await saveAction({ URL, body: formData, button: addButton });
        if (responseData.status === 0) return false;
        const template = document.querySelector(`.dropdownTemplate`);
        const cloneNode = template.content.cloneNode(true);
        const selectElement = cloneNode.querySelector(`.selectElement`);
        const editField = cloneNode.querySelector(`.editField`);
        selectElement.innerText = createField.value;
        selectElement.dataset.request = responseData.requestID;
        editField.value = createField.value;
        dropdownWrapper.insertBefore(cloneNode, newWrapper);
        selectData(selectElement);
        // hide input field
        createField.value = ``;
        editWrapper.classList.add(`hiddenWrapper`);
        createButton.classList.remove(`hiddenWrapper`);
    };
    createButton.addEventListener(`click`, changeAddVisible);
    addButton.addEventListener(`click`, saveData);
});

// preview upload on portfolio
const uploadFields = document.querySelectorAll(`.previewUpload`);
uploadFields.forEach((uploadField) => {
    const files = {};
    const collectFiles = () => {
        [...uploadField.files].forEach((file) => {
            files[file.name] = file;
        });
    };
    uploadField.addEventListener(`change`, collectFiles);
});

// similar buttons on ideas
const similarButtons = [...document.querySelectorAll(`.similarButton`)];
const removeActiveSimilar = (parentWrapper) => {
    const categoriesParent = [...document.querySelectorAll(`.catFilter`)];
    categoriesParent.forEach((parentNode) => {
        // remove field
        const similarField = parentNode.querySelector(`.similarField`);
        if (similarField) parentNode.removeChild(similarField);
        // remove active class
        if (parentNode === parentWrapper) return false;
        parentNode.classList.remove(`similarFilter`);
    });
};
const createSimilarField = (categoryID) => {
    const similarField = document.createElement(`input`);
    similarField.setAttribute(`type`, `hidden`);
    similarField.classList.add(`similarField`, `hiddenField`);
    similarField.setAttribute(`name`, `similarID`);
    similarField.value = categoryID;
    return similarField;
};
const clearModerate = () => {
    const moderateCheckNode = document.querySelector(`input[name="isModerated"]`);
    moderateCheckNode.checked = false;
};
similarButtons.forEach((similarButton) => {
    const { dataset: { category: categoryID }} = similarButton;
    const parentWrapper = similarButton.closest(`.catFilter`);
    if (!parentWrapper) return false;
    similarButton.addEventListener(`click`, () => {
        removeActiveSimilar(parentWrapper);
        const isActive = parentWrapper.classList.contains(`similarFilter`);
        if (isActive) clearModerate();
        const classAction = (isActive) ? `remove` : `add`;
        parentWrapper.classList[classAction](`similarFilter`);
        if (!isActive) {
            const similarField = createSimilarField(categoryID);
            parentWrapper.appendChild(similarField);
        }
    });
});

// idea categories
let isLoading = false;
const editWrapper = (wrapper) => {
    const showButton = (button) => button.classList.remove(`hiddenButton`);
    const hideButton = (button) => button.classList.add(`hiddenButton`);
    const categories = [...wrapper.querySelectorAll(`li`)];
    categories.forEach((category) => {
        const formNode = category.querySelector(`form`);
        const saveButton = category.querySelector(`.saveButton`);
        const previewField = category.querySelector(`.fileFiled`);
        const titleField = category.querySelector(`.titleField`);
        const linkField = category.querySelector(`.linkField`);
        const colorField = category.querySelector(`.colorField`);
        const categoryPreview = category.querySelector(`.categoryPreview`);
        if (previewField) {
            previewField.addEventListener(`change`, () => {
                showButton(saveButton);
                const reader = new FileReader();
                reader.addEventListener(`load`, () => {
                    categoryPreview.src = reader.result;
                    categoryPreview.classList.remove(`hiddenPreview`);
                });
                reader.readAsDataURL(previewField.files[0]);
            });
        }
        if (titleField) {
            titleField.addEventListener(`input`, () => {
                showButton(saveButton);
            });
        }
        if (linkField) {
            linkField.addEventListener(`input`, () => {
                showButton(saveButton);
            });
        }
        if (colorField) {
            colorField.addEventListener(`input`, () => {
                showButton(saveButton);
            });
        }
        if (saveButton) {
            saveButton.addEventListener(`click`, async () => {
                if (isLoading) return false;
                isLoading = true;
                const formData = new FormData(formNode);
                const fieldTitle = (formData.has(`categoryTitle`)) ?
                    formData.get(`categoryTitle`) : formData.get(`filterTitle`);
                const isEmpty = !fieldTitle.length;
                const fieldID = formData.get(`categoryID`) || formData.get(`filterID`);
                const isNew = !fieldID;
                const method = (isEmpty) ? `delete` : `post`;
                const responseOptions = { URL: formNode.action, method, body: formData, button: saveButton };
                const responseData = await saveAction(responseOptions);
                isLoading = false;
                if (responseData.status !== 1) return false; // show error
                hideButton(saveButton);
                if (isNew || isEmpty) location.reload(); // need to create JS dynamic func
            });
        }
    });
};

const categoriesWrapper = [...document.querySelectorAll(`.editCategories`)];
categoriesWrapper.forEach(editWrapper);
const filtersWrapper = [...document.querySelectorAll(`.editFilters`)];
filtersWrapper.forEach(editWrapper);

// portfolio images
const previewsWrapper = [...document.querySelectorAll(`.previewsWrapper`)];
previewsWrapper.forEach((wrapper) => {
    const template = document.querySelector(`.previewTemplate`);
    const workImageField = wrapper.querySelector(`.hiddenField`);
    const removeSelect = (wrapper) => wrapper.classList.remove(`workImage`);
    const selectCurrent = (imageWrapper) => {
        const isAddButton = (imageWrapper.classList.contains(`addWrapper`));
        const { dataset: { image: imageID }} = imageWrapper;
        return (event) => {
            if (event.target.classList.contains(`deleteImageButton`)) return false;
            if (event.target.classList.contains(`uploadedButton`)) return false;
            if (isAddButton) return false;
            [...wrapper.querySelectorAll(`.imageWrapper`)].forEach(removeSelect);
            imageWrapper.classList.add(`workImage`);
            if (workImageField) workImageField.value = (imageID) ? imageID : 0;
        };
    };
    const addDeleteAction = (deleteButton) => {
        let isActive = false;
        deleteButton.addEventListener(`click`, () => {
            const parentWrapper = deleteButton.parentNode.querySelector(`.deleteWrapper`);
            const classAction = (isActive) ? `remove` : `add`;
            parentWrapper.classList[classAction](`activeWrapper`);
            isActive = !isActive;
        });
    };
    const showPreview = (files) => {
        files.forEach((file) => {
            const reader = new FileReader();
            const deletePreview = (imageWrapper) => {
                return () => {
                    wrapper.removeChild(imageWrapper);
                };
            };
            const createPreview = () => {
                const templateClone = template.content.cloneNode(true);
                const imageWrapper = templateClone.querySelector(`.imageWrapper`);
                const imagePreview = imageWrapper.querySelector(`.imagePreview`);
                const deleteButton = imageWrapper.querySelector(`.wrapperButton`);
                deleteButton.addEventListener(`click`, deletePreview(imageWrapper));
                imageWrapper.addEventListener(`click`, selectCurrent(imageWrapper));
                const deleteImageButton = imageWrapper.querySelector(`.deleteImageButton`);
                addDeleteAction(deleteImageButton);
                imagePreview.src = reader.result;
                imageWrapper.file = file;
                wrapper.appendChild(imageWrapper);
            };
            reader.addEventListener(`load`, createPreview);
            reader.readAsDataURL(file);
        });
    };
    const addDeleteListener = async (button) => {
        button.addEventListener(`click`, async () => {
            const { dataset: { image: imageID, api: deleteURL }} = button;
            const URL = (deleteURL) ? deleteURL : `/admin/portfolio/images/${imageID}`;
            const responseOptions = { URL, method: `DELETE`, button };
            const responseData = await saveAction(responseOptions);
            if (responseData.status === 0) return false;
            const imageWrapper = button.closest(`.imageWrapper`);
            wrapper.removeChild(imageWrapper);
        });
    };
    const showLoadedFile = (data) => {
        const { requestID: sliderID, sliderImage } = data;
        const templateClone = template.content.cloneNode(true);
        const imageWrapper = templateClone.querySelector(`.imageWrapper`);
        const imagePreview = imageWrapper.querySelector(`.imagePreview`);
        const deleteButton = imageWrapper.querySelector(`.wrapperButton`);
        const deleteImageButton = imageWrapper.querySelector(`.deleteImageButton`);
        addDeleteAction(deleteImageButton);
        deleteButton.dataset.api = `/admin/landings/header-images/${ sliderID }`;
        imageWrapper.dataset.image = sliderID;
        imageWrapper.dataset.id = sliderID;
        imagePreview.src = sliderImage + `_1000x619.jpg`;
        addDeleteListener(deleteButton);
        wrapper.appendChild(imageWrapper);
    };
    const requestPosition = () => {
        const sliders = [...wrapper.querySelectorAll(`.uploadedWrapper`)];
        return sliders.length + 1;
    };
    const uploadField = wrapper.querySelector(`.previewUpload`);
    uploadField.addEventListener(`change`, async () => {
        const { dataset: { load: loadURL, name: imageName }} = uploadField;
        if (loadURL) {
            const body = new FormData;
            body.append(imageName, uploadField.files[0]);
            body.append(`position`, requestPosition());
            const response = await fetch(loadURL, { method: `POST`, body });
            const data = await response.json();
            return showLoadedFile(data);
        }
        showPreview([...uploadField.files]);
        uploadField.value = ``;
    });
    const deleteUploadButtons = [...document.querySelectorAll(`.uploadedButton`)];
    deleteUploadButtons.forEach(addDeleteListener);
    const uploadedImages = [...document.querySelectorAll(`.imageWrapper`)];
    uploadedImages.forEach((uploadedWrapper) => {
        uploadedWrapper.addEventListener(`click`, selectCurrent(uploadedWrapper));
    });
    document.addEventListener(`successSave`, (event) => {
        const createdWrappers = [...document.querySelectorAll(`.createdWrapper`)];
        createdWrappers.forEach((wrapper) => {
            wrapper.classList.replace(`createdWrapper`, `uploadedWrapper`);
        });
    });
    // delete image buttons
    const deleteImageButtons = [...document.querySelectorAll(`.deleteImageButton`)];
    deleteImageButtons.forEach(addDeleteAction);
});

// loader
if (document.querySelector(`.elementsWrapper`)) {
    requestData();
    loader(window.loaderData);
}

const sortWrapper = document.querySelector(`.sortWrapper`);
const sortNodes = [...document.querySelectorAll(`.sortNode`)];
let hoverElement, handleElement;
const requestIndex = (searchElement) => {
    const sortNodes = [...document.querySelectorAll(`.sortNode`)];
    let searchIndex;
    sortNodes.forEach((element, index) => {
        if (element === searchElement) searchIndex = index;
    });
    return searchIndex;
};
const collectData = () => {
    const data = new FormData();
    const sortNodes = [...document.querySelectorAll(`.sortNode`)];
    sortNodes.forEach((element, index) => {
        const { dataset: { id: portfolioID }} = element;
        data.append(portfolioID, index);
    });
    return data;
};
const removeHover = () => {
    const sortNodes = [...document.querySelectorAll(`.sortNode`)];
    sortNodes.forEach((element) => element.classList.remove(`hoverWrapper`));
};
const addReplaceEvents = (sortNode) => {
    sortNode.addEventListener(`dragstart`, (event) => {
        event.dataTransfer.effectAllowed = `move`;
        const handleWrapper = event.target.closest(`.sortNode`);
        hoverElement = handleWrapper;
        handleElement = handleWrapper;
        hoverElement.classList.add(`handleWrapper`);
    });
    sortNode.addEventListener(`dragover`, (event) => {
        const hoverWrapper = event.target.closest(`.sortNode`);
        if (hoverElement === hoverWrapper) return false;
        event.dataTransfer.dropEffect = `move`;
        removeHover();
        hoverWrapper.classList.add(`hoverWrapper`);
        hoverElement = hoverWrapper;
        event.preventDefault();
    });
    sortNode.addEventListener(`dragend`, async () => {
        if (hoverElement === handleElement) {
            handleElement.classList.remove(`handleWrapper`);
            removeHover();
            return false;
        }
        const hoverIndex = requestIndex(hoverElement);
        const handleIndex = requestIndex(handleElement);
        removeHover();
        handleElement.classList.replace(`handleWrapper`, `loaderWrapper`);
        const cloneNode = handleElement.cloneNode(true);
        // addReplaceEvents(cloneNode);
        sortWrapper.removeChild(handleElement);
        const changeNode = (hoverIndex > handleIndex) ? hoverElement.nextSibling : hoverElement;
        sortWrapper.insertBefore(cloneNode, changeNode);
        // collect index
        const body = collectData();
        const { dataset: { sort: sortURL }} = sortWrapper;
        const response = await fetch(sortURL, { method: `POST`, body });
        const data = await response.json();
        if (data.status !== 1) return console.log(data);
        cloneNode.classList.remove(`loaderWrapper`);
    });
};
if (sortNodes && sortNodes.length) sortNodes.forEach(addReplaceEvents);
// mutation observer
const loaderOptions = { attributes: true, childList: true, subtree: true };
const loaderCallback = (mutationsList) => {
    mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
            if (!addedNode.querySelector) return false;
            addReplaceEvents(addedNode);
        })
    });
};
const observer = new MutationObserver(loaderCallback);
if (sortWrapper) observer.observe(sortWrapper, loaderOptions);



// filters sorting
const moveSection = document.querySelector(`.moveSection`);
// main nodes
const nodeIndex = (searchNode) => {
    let searchIndex;
    [...searchNode.parentNode.children].forEach((element, index) => {
        if (element === searchNode) searchIndex = index;
    });
    return searchIndex;
};
const collectIndex = () => {
    const data = new FormData();
    const sortNodes = [...document.querySelectorAll(`.moveNode`)];
    sortNodes.forEach((element, index) => {
        const { dataset: { id: portfolioID }} = element;
        data.append(portfolioID, index);
    });
    return data;
};
const mainNodes = [...document.querySelectorAll(`.moveNode.mainNode`)];
let mainHandle, mainHandleNode, mainSelect;
const addMainListeners = (moveNode) => {
    const parentWrapper = moveNode.closest(`.moveWrapper`);
    moveNode.addEventListener(`dragstart`, () => {
        mainHandle = parentWrapper;
        mainHandleNode = moveNode;
        parentWrapper.classList.add(`activeWrapper`);
    });
    parentWrapper.addEventListener(`dragover`, () => {
        if (!mainHandleNode || !mainHandleNode.classList.contains(`mainNode`)) return false;
        mainSelect = parentWrapper;
        parentWrapper.classList.add(`hoverWrapper`);
    });
    parentWrapper.addEventListener(`dragleave`, () => {
        if (!parentWrapper) return false;
        parentWrapper.classList.remove(`hoverWrapper`);
    });
    moveNode.addEventListener(`dragend`, async () => {
        if (!mainHandle || !mainSelect) return false;
        parentWrapper.classList.remove(`activeWrapper`);
        const selectIndex = nodeIndex(mainSelect);
        const handleIndex = nodeIndex(mainHandle);
        const changeNode = (selectIndex > handleIndex) ? mainSelect.nextSibling : mainSelect;
        mainHandle.parentNode.insertBefore(mainHandle, changeNode);
        const { dataset: { sort: URL }} = moveSection;
        const response = await fetch(URL, { method: `POST`, body: collectIndex() });
        const data = await response.json();
        if (data.status !== 1) console.log(data.error);
        mainHandle = null; mainHandleNode = null; mainSelect = null;
    });
};
mainNodes.forEach(addMainListeners);
// child nodes
let childHandle, childSelect;
const childNodes = [...document.querySelectorAll(`.moveNode.childNode`)];
const addChildListeners = (moveNode) => {
    moveNode.addEventListener(`dragstart`, (event) => {
        event.dataTransfer.effectAllowed = `move`;
        childHandle = moveNode;
        childHandle.classList.add(`activeNode`);
    });
    moveNode.addEventListener(`dragover`, (event) => {
        if (!childHandle) return false;
        if (childHandle === moveNode) return false;
        if (moveNode.parentNode !== childHandle.parentNode) return false;
        event.dataTransfer.dropEffect = `move`;
        childSelect = moveNode;
        moveNode.classList.add(`hoverNode`);
        event.preventDefault();
    });
    moveNode.addEventListener(`dragleave`, () => {
        moveNode.classList.remove(`hoverNode`);
    });
    moveNode.addEventListener(`dragend`, async () => {
        childHandle.classList.remove(`activeNode`);
        if (!childHandle || !childSelect) return false;
        if (childSelect.parentNode !== childHandle.parentNode) return false;
        const selectIndex = nodeIndex(childSelect);
        const handleIndex = nodeIndex(childHandle);
        const changeNode = (selectIndex > handleIndex) ? childSelect.nextSibling : childSelect;
        childHandle.parentNode.insertBefore(childHandle, changeNode);
        childSelect.classList.remove(`hoverNode`);
        const body = collectIndex();
        const { dataset: { sort: URL }} = moveSection;
        const response = await fetch(URL, { method: `POST`, body });
        const data = await response.json();
        if (data.status !== 1) console.log(data.error);
        childHandle = null; childSelect = null;
    });
};
childNodes.forEach(addChildListeners);


// categories sorting
const catSection = document.querySelector(`.catSection`);
// categories main nodes
const catNodes = [...document.querySelectorAll(`.catNode.catMain`)];
let catMainHandle, catMainHandleNode, catMainSelect, catChildHandle,
    catChildSelect, catInnerHandle, catInnerSelect;
const resetVariables = () => {
    catMainHandle = null; catMainHandleNode = null;
    catMainSelect = null; catChildHandle = null;
    catChildSelect = null; catInnerHandle = null;
    catInnerSelect = null;
}
const collectCatIndex = () => {
    const data = new FormData();
    const sortNodes = [...document.querySelectorAll(`.catNode`)];
    sortNodes.forEach((element, index) => {
        const { dataset: { id: portfolioID }} = element;
        data.append(portfolioID, index);
    });
    return data;
};
const sendIndexData = async () => {
    const body = collectCatIndex();
    const { dataset: { sort: URL }} = catSection;
    const response = await fetch(URL, { method: `POST`, body });
    const data = await response.json();
    if (data.status !== 1) console.log(data.error);
};
const addCatMainListeners = (catNode) => {
    const parentWrapper = catNode.closest(`.catWrapper`);
    catNode.addEventListener(`dragstart`, (event) => {
        event.dataTransfer.effectAllowed = `move`;
        catMainHandle = parentWrapper;
        catMainHandleNode = catNode;
        parentWrapper.classList.add(`activeWrapper`);
    });
    parentWrapper.addEventListener(`dragover`, (event) => {
        if (!catMainHandleNode || !catMainHandleNode.classList.contains(`catNode`)) return false;
        event.dataTransfer.dropEffect = `move`;
        catMainSelect = parentWrapper;
        parentWrapper.classList.add(`hoverWrapper`);
        event.preventDefault();
    });
    parentWrapper.addEventListener(`dragleave`, () => {
        parentWrapper.classList.remove(`hoverWrapper`);
    });
    catNode.addEventListener(`dragend`, async () => {
        if (!catMainHandle || !catMainSelect) return false;
        parentWrapper.classList.remove(`activeWrapper`);
        catMainSelect.classList.remove(`hoverWrapper`);
        const selectIndex = nodeIndex(catMainSelect);
        const handleIndex = nodeIndex(catMainHandle);
        const changeNode = (selectIndex > handleIndex) ? catMainSelect.nextSibling : catMainSelect;
        catMainHandle.parentNode.insertBefore(catMainHandle, changeNode);
        resetVariables();
        sendIndexData();
    });
};
catNodes.forEach(addCatMainListeners);
// request index
const childIndex = (searchNode) => {
    let searchIndex;
    [...searchNode.closest(`.childSection`).children].forEach((element, index) => {
        if (element === searchNode.parentNode) searchIndex = index;
    });
    return searchIndex;
};
// categories child nodes
const catChildNodes = [...document.querySelectorAll(`.catNode.catChild`)];
const addCatChildListeners = (catNode) => {
    const childWrapper = catNode.closest(`.childWrapper`);
    catNode.addEventListener(`dragstart`, (event) => {
        if (catNode.classList.contains(`catInner`)) return false;
        event.dataTransfer.effectAllowed = `move`;
        catChildHandle = childWrapper;
        childWrapper.classList.add(`activeWrapper`);
    });
    childWrapper.addEventListener(`dragover`, (event) => {
        if (!catChildHandle) return false;
        if (childWrapper.parentNode.parentNode !== catChildHandle.parentNode.parentNode) return false;
        event.dataTransfer.dropEffect = `move`;
        childWrapper.classList.add(`hoverWrapper`);
        catChildSelect = childWrapper;
        event.preventDefault();
    });
    childWrapper.addEventListener(`dragleave`, () => {
        childWrapper.classList.remove(`hoverWrapper`);
    });
    catNode.addEventListener(`dragend`, async () => {
        childWrapper.classList.remove(`activeWrapper`);
        catChildSelect.classList.remove(`hoverWrapper`);
        if (!catChildHandle || !catChildSelect) return false;
        const selectIndex = childIndex(catChildSelect);
        const handleIndex = childIndex(catChildHandle);
        const selectParent = catChildSelect.parentNode;
        const handleParent = catChildHandle.parentNode;
        const changeNode = (selectIndex > handleIndex) ? selectParent.nextSibling : selectParent;
        changeNode.parentNode.insertBefore(handleParent, changeNode);
        resetVariables();
        sendIndexData();
    });
};
catChildNodes.forEach(addCatChildListeners);
// categories inner nodes
const catInnerNodes = [...document.querySelectorAll(`.catNode.catInner`)];
const addCatInnerListeners = (catNode) => {
    const innerWrapper = catNode.closest(`.childWrapper`);
    catNode.addEventListener(`dragstart`, (event) => {
        event.dataTransfer.effectAllowed = `move`;
        catInnerHandle = catNode;
        catInnerHandle.classList.add(`activeNode`);
    });
    catNode.addEventListener(`dragover`, (event) => {
        if (!catInnerHandle) return false;
        if (catInnerHandle === catNode) return false;
        if (catNode.parentNode !== catInnerHandle.parentNode) return false;
        event.dataTransfer.dropEffect = `move`;
        catInnerSelect = catNode;
        catNode.classList.add(`hoverNode`);
        event.preventDefault();
    });
    catNode.addEventListener(`dragleave`, () => {
        catNode.classList.remove(`hoverNode`);
    });
    catNode.addEventListener(`dragend`, async () => {
        catInnerHandle.classList.remove(`activeNode`);
        innerWrapper.classList.remove(`hoverWrapper`);
        if (!catInnerHandle || !catInnerSelect) return false;
        if (catInnerSelect.parentNode !== catInnerHandle.parentNode) return false;
        const selectIndex = nodeIndex(catInnerSelect);
        const handleIndex = nodeIndex(catInnerHandle);
        const changeNode = (selectIndex > handleIndex) ? catInnerSelect.nextSibling : catInnerSelect;
        catInnerHandle.parentNode.insertBefore(catInnerHandle, changeNode);
        catInnerSelect.classList.remove(`hoverNode`);
        resetVariables();
        sendIndexData();
    });
};
catInnerNodes.forEach(addCatInnerListeners);

// update moderate count
const updateModerateCount = async () => {
    const ideasCount = document.querySelector(`.ideasCount`);
    const response = await fetch(`/api/ideas/to-moderate/count`);
    const { moderateCount } = await response.json();
    ideasCount.innerText = moderateCount;
};

// delete buttons
const archiveButtons = [...document.querySelectorAll(`.archiveButton`)];
const ideaWrapper = document.querySelector(`.listNode`);
const archiveIdea = (archiveButton) => {
    const ideaParent = archiveButton.closest(`.listWrapper`);
    const ideaImage = ideaParent.querySelector(`.listImage`);
    const { dataset: { idea: ideaID }} = ideaImage;
    archiveButton.addEventListener(`click`, async (event) => {
        event.preventDefault();
        ideaParent.classList.add(`loaderWrapper`);
        const updateData = new FormData;
        updateData.append(`ideaID`, ideaID);
        updateData.append(`isArchived`, `1`);
        const options = { method: `POST`, body: updateData };
        const response = await fetch(`/admin/basement-ideas/archive/add`, options);
        const { status } = await response.json();
        if (status !== 1) {
            ideaParent.classList.remove(`loaderWrapper`);
            return false;
        }
        ideaWrapper.removeChild(ideaParent);
        await updateModerateCount();
    });
}
archiveButtons.forEach(archiveIdea);
const ideasOptions = { attributes: true, childList: true, subtree: true };
const ideasCallback = (mutationsList) => {
    mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
            if (!addedNode.querySelector) return false;
            const archiveButton = addedNode.querySelector(`.archiveButton`);
            if (archiveButton) archiveIdea(archiveButton);
        })
    });
};
const ideasObserver = new MutationObserver(ideasCallback);
if (archiveButtons.length) ideasObserver.observe(ideaWrapper, ideasOptions);

// check show more button status
document.addEventListener(`dataLoaded`, () => {
    const loadButton = document.querySelector(`.showMoreButton`);
    if (!loadButton) return false;
    const { dataset: { min }} = loadButton;
    if (window.responseData.length <= Number(min)) loadButton.classList.add(`hiddenButton`);
});

// zipcode zones
const zipForms = [...document.querySelectorAll(`form.zipZone`)];
zipForms.forEach((form) => {
    const { action: actionLink } = form;
    const updateButton = form.querySelector(`.updateButton`);
    const createButton = form.querySelector(`.createButton`);
    const fields = [...form.querySelectorAll(`.textField, .textareaField`)];
    // check for field edit
    fields.forEach((field) => {
        field.addEventListener(`input`, () => {
            if (updateButton) updateButton.removeAttribute(`disabled`);
            if (createButton) createButton.removeAttribute(`disabled`);
        });
    });
    const updateData = async () => {
        updateButton.classList.add(`loadButton`);
        const body = new FormData(form);
        const response = await fetch(actionLink, { method: `POST`, body });
        const { status }  = await response.json();
        if (status === 1) updateButton.classList.remove(`loadButton`);
    };
    const createData = async () => {
        createButton.classList.add(`loadButton`);
        const body = new FormData(form);
        const response = await fetch(actionLink, { method: `POST`, body });
        const { status }  = await response.json();
        if (status === 1) return location.reload();
    };
    if (updateButton) updateButton.addEventListener(`click`, updateData);
    if (createButton) createButton.addEventListener(`click`, createData);
});

// isModerate check ideas
const moderateCheckNode = document.querySelector(`input[name="isModerated"]`);
if (moderateCheckNode) {
    let errorTimeout = false;
    const errorWrapper = moderateCheckNode.parentNode.querySelector(`.buttonHiddenWrapper`);
    moderateCheckNode.addEventListener(`change`, () => {
        if (!moderateCheckNode.checked) return false;
        const isFilterSelect = [...document.querySelectorAll(`.similarFilter`)].length > 0;
        if (!isFilterSelect) {
            moderateCheckNode.checked = false;
            if (errorTimeout) return false;
            errorWrapper.classList.remove(`hiddenWrapper`);
            errorTimeout = true;
            setTimeout(() => {
                errorWrapper.classList.add(`hiddenWrapper`);
                errorTimeout = false;
            }, 2000);
        }
    });
}