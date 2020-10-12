import { loader, requestData, saveAction } from "../../source/scripts/utils";

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
    [...files].forEach((file) => {
        const reader = new FileReader();
        reader.addEventListener(`load`, () => {
            const uploadThumb = createUploadPicture(reader.result, file.name);
            fieldWrapper.appendChild(uploadThumb);
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

// idea categories
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
        const removeCategory = () => {
            const categoryID = category.querySelector(`.categoryID`).value;
            const categoryWrapper = category.closest(`ul`);
            const childSelector = `[data-parent="${categoryID}"]`;
            const childCategories = [...categoryWrapper.querySelectorAll(childSelector)];
            childCategories.forEach((childCategory) => categoryWrapper.removeChild(childCategory));
            categoryWrapper.removeChild(category);
        };
        const removeFilter = () => {
            const filterID = category.querySelector(`.filterID`).value;
            const filterWrapper = category.closest(`ul`);
            const childSelector = `[data-parent="${filterID}"]`;
            const childFilters = [...filterWrapper.querySelectorAll(childSelector)];
            childFilters.forEach((childCategory) => filterWrapper.removeChild(childCategory));
            filterWrapper.removeChild(category);
        };
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
                const formData = new FormData(formNode);
                const fieldTitle = formData.get(`categoryTitle`) || formData.get(`filterTitle`);
                const isEmpty = !fieldTitle.length;
                const fieldID = formData.get(`categoryID`) || formData.get(`filterID`);
                const isNew = !fieldID;
                const method = (isEmpty) ? `delete` : `post`;
                const responseOptions = { URL: formNode.action, method, body: formData, button: saveButton };
                const responseData = await saveAction(responseOptions);
                if (responseData.status !== 1) return false; // show error
                if (isEmpty) {
                    if (formData.get(`categoryID`)) removeCategory();
                    if (formData.get(`filterID`)) removeFilter();
                }
                hideButton(saveButton);
                if (isNew) location.reload(); // need to create JS dynamic func
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
            if (event.target.classList.contains(`uploadedButton`)) return false;
            if (isAddButton) return false;
            [...wrapper.querySelectorAll(`.imageWrapper`)].forEach(removeSelect);
            imageWrapper.classList.add(`workImage`);
            if (workImageField) workImageField.value = (imageID) ? imageID : 0;
        };
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
                imagePreview.src = reader.result;
                imageWrapper.file = file;
                wrapper.appendChild(imageWrapper);
            };
            reader.addEventListener(`load`, createPreview);
            reader.readAsDataURL(file);
        });
    };
    const uploadField = wrapper.querySelector(`.previewUpload`);
    uploadField.addEventListener(`change`, () => {
        showPreview([...uploadField.files]);
        uploadField.value = ``;
    });
    const deleteUploadButtons = [...document.querySelectorAll(`.uploadedButton`)];
    deleteUploadButtons.forEach((button) => {
        button.addEventListener(`click`, async () => {
            const { dataset: { image: imageID }} = button;
            const URL = `/admin/portfolio/images/${imageID}`;
            const responseOptions = { URL, method: `delete`, button };
            const responseData = await saveAction(responseOptions);
            if (responseData.status === 0) return false;
            const imageWrapper = button.closest(`.imageWrapper`);
            wrapper.removeChild(imageWrapper);
        });
    })
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
    const sortNodes = [...document.querySelectorAll(`.listWrapper`)];
    let searchIndex;
    sortNodes.forEach((element, index) => {
        if (element === searchElement) searchIndex = index;
    });
    return searchIndex;
};
const collectData = () => {
    const data = new FormData();
    const sortNodes = [...document.querySelectorAll(`.listWrapper`)];
    sortNodes.forEach((element, index) => {
        const { dataset: { id: portfolioID }} = element;
        data.append(portfolioID, index);
    });
    return data;
};
const removeHover = () => {
    const sortNodes = [...document.querySelectorAll(`.listWrapper`)];
    sortNodes.forEach((element) => element.classList.remove(`hoverWrapper`));
};
const addReplaceEvents = (sortNode) => {
    sortNode.addEventListener(`dragstart`, (event) => {
        const handleWrapper = event.target.closest(`.listWrapper`);
        hoverElement = handleWrapper;
        handleElement = handleWrapper;
        hoverElement.classList.add(`handleWrapper`);
    });
    sortNode.addEventListener(`dragover`, (event) => {
        const hoverWrapper = event.target.closest(`.listWrapper`);
        if (hoverElement === hoverWrapper) return false;
        removeHover();
        hoverWrapper.classList.add(`hoverWrapper`);
        hoverElement = hoverWrapper;
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

const loaderOptions = { attributes: true, childList: true, subtree: true };

// Функция обратного вызова при срабатывании мутации
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