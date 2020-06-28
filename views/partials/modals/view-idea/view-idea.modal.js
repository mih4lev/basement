import {changeModalVisible, saveAction, setModal} from "../modals";

export const viewIdeaModal = () => {

    const animationTimeout = 250;

    const modalNode = setModal(`view-idea`)
    const modalContent = modalNode.querySelector(`.contentWrapper`);
    const ideaList = document.querySelector(`.ideaList`);
    const ideaPhotos = [...document.querySelectorAll(`.ideaPhoto`)];
    const formNode = modalNode.querySelector(`form`);
    const saveButton = modalNode.querySelector(`.saveCollectionButton`);
    const modalArrows = [...modalNode.querySelectorAll(`.ideaArrow `)];
    const closeButton = modalNode.querySelector(`.closeButton`);
    // modalData
    const ideaIDNode = modalNode.querySelector(`#ideaID`);
    const sectionTitle = modalNode.querySelector(`.sectionTitle`);
    const ideaAuthor = modalNode.querySelector(`.ideaAuthor`);
    const countWrapper = modalNode.querySelector(`.countWrapper`);
    const ideaLink = modalNode.querySelector(`.ideaLink`);
    const ideaLabelList = modalNode.querySelector(`.ideaLabelList`);
    const otherPreviewList = modalNode.querySelector(`.otherPreviewList`);
    const ideaModalPhoto = modalNode.querySelector(`.ideaModalPhoto`);
    const ideaModalWrapper = modalNode.querySelector(`.ideaPhotoWrapper`);

    // clear modal data
    const clearModalData = () => {
        return new Promise(async (resolve, reject) => {
            changeDataVisible({ isVisible: false });
            // timeout 250 ms for change visible
            setTimeout(() => {
                ideaIDNode.value = ``;
                sectionTitle.innerText = ``;
                ideaAuthor.innerText = ``;
                countWrapper.innerText = ``;
                ideaLink.innerText = ``;
                ideaLink.removeAttribute(`href`);
                ideaLabelList.innerHTML = ``;
                otherPreviewList.innerHTML = ``;
                changeButtonStatus({ isDisabled: false });
                resolve();
            }, animationTimeout);
        });
    };

    // check arrow visible
    const checkArrowVisible = (isVisible) => {
        const ideas = [...ideaList.children];
        const ideaID = Number(ideaIDNode.value);
        const isFirstButton = ideas[0].classList.contains(`buttonWrapper`);
        const firstNode = (isFirstButton) ? ideas[1] : ideas[0];
        const lastNode = ideas[ideas.length - 1];
        const firstID = Number(firstNode.querySelector(`.ideaPhoto`).dataset.idea);
        const lastID = Number(lastNode.querySelector(`.ideaPhoto`).dataset.idea);
        modalArrows.forEach((arrow) => {
            const isNext = (arrow.classList.contains(`nextArrow`));
            const isHidden = (isNext && ideaID === lastID) || (!isNext && ideaID === firstID);
            const classAction = (isHidden) ? `add` : `remove`;
            arrow.classList[classAction](`hiddenArrow`);
            arrow.disabled = isHidden || !isVisible;
            arrow.title = (isNext && !isHidden) ? `Next idea` :
                          (!isNext && !isHidden) ? `Previous idea` : ``;
        });
    };

    // hide or show modal data
    const changeDataVisible = ({ isVisible = false }) => {
        const classAction = (isVisible) ? `remove` : `add`;
        modalContent.classList[classAction](`showLoadStatus`);
        closeButton.disabled = !isVisible;
        checkArrowVisible(isVisible);
    };

    // create tag list for modal data
    const createTagList = (tagList) => {
        tagList.forEach((tagName) => {
            const tagNode = document.createElement(`li`);
            tagNode.classList.add(`ideaLabel`);
            tagNode.innerText = tagName;
            ideaLabelList.appendChild(tagNode);
        });
    };

    // check webp support
    const selectPictureFormat = () => {
        const isSupportWebp = document.querySelector(`html`).classList.contains(`webp`);
        return (isSupportWebp) ? `.webp` : `.jpg`;
    }

    // create preview list for modal data
    const createPreviewList = (previewList) => {
        previewList.forEach(({ thumb, picture, title }) => {
            const pictureFormat = selectPictureFormat();
            // li
            const previewNode = document.createElement(`li`);
            previewNode.classList.add(`otherPreviewWrapper`);
            previewNode.dataset.picture = `/public/images/temp/${picture}${pictureFormat}`;
            previewNode.dataset.title = title;
            // img
            const previewPicture = document.createElement(`img`);
            previewPicture.classList.add(`otherPreview`);
            previewPicture.src = `/public/images/temp/${thumb}${pictureFormat}`;
            previewPicture.setAttribute(`alt`, title);
            // append
            previewNode.appendChild(previewPicture);
            otherPreviewList.appendChild(previewNode);
        });
        // preview thumbs click handler
        [...otherPreviewList.children].forEach((thumb) => {
            const { dataset: { picture, title }} = thumb;
            ideaModalPhoto.addEventListener(`load`, () => {
                setTimeout(() => {
                    ideaModalWrapper.classList.remove(`loadWrapper`);
                }, animationTimeout);
            });
            thumb.addEventListener(`click`, () => {
                ideaModalWrapper.classList.add(`loadWrapper`);
                setTimeout(() => {
                    ideaModalPhoto.src = picture;
                    ideaModalPhoto.setAttribute(`alt`, title);
                }, animationTimeout);
            });
        });
    };

    const selectModalPicture = ({ picture, title }) => {
        const pictureFormat = selectPictureFormat();
        ideaModalPhoto.src = `/public/images/temp/${picture}${pictureFormat}`;
        ideaModalPhoto.setAttribute(`title`, title);
    };

    // set requested data to modal
    const setModalData = (responseData) => {
        const { id, header, author, saveCount, category, categoryLink, tagList, previewList } = responseData;
        // set data to modal
        ideaIDNode.value = id;
        sectionTitle.innerText = header;
        ideaAuthor.innerText = author;
        countWrapper.innerText = saveCount;
        ideaLink.innerText = category;
        ideaLink.setAttribute(`href`, categoryLink);
        // create tag list
        createTagList(tagList)
        // create thumbs list
        createPreviewList(previewList)
        // select first image
        selectModalPicture(previewList[0]);
    };

    // request from DB for modal data
    const requestModalData = async (ideaID) => {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(`/api/ideas/${ideaID}`);
            const responseData = await response.json();
            setModalData(responseData);
            // minimal timeout for animation
            setTimeout(async () => resolve(), animationTimeout);
        });
    };

    // change save to collection button status
    const changeButtonStatus = ({ isDisabled = false } = {}) => {
        const classAction = (isDisabled) ? `add` : `remove`;
        const buttonTitle = (isDisabled) ? `Already saved to collection` : `Save to collection`;
        saveButton.disabled = isDisabled;
        saveButton.classList[classAction](`savedButton`);
        saveButton.setAttribute(`title`, buttonTitle);
    };

    // update saved count on sav idea
    const updateSavedCount = () => {
        const saveCount = modalNode.querySelector(`.saveCount .countWrapper`);
        const prevValue = Number(saveCount.innerText);
        saveCount.innerText = prevValue + 1;
    };

    // save idea to profile DB
    const saveIdea = async (event) => {
        event.preventDefault();
        const formData = new FormData(formNode);
        const responseOptions = { URL: `/api/profile/ideas`, body: formData, button: saveButton };
        const responseData = await saveAction(responseOptions);
        if (responseData.code !== 200) return changeButtonStatus({ isDisabled: false });
        changeButtonStatus({ isDisabled: true });
        updateSavedCount();
    };

    // show idea modal
    const showModal = (ideaPhoto) => {
        ideaPhoto.addEventListener(`click`, async () => {
            const { dataset: { idea: ideaID }} = ideaPhoto;
            changeModalVisible(modalNode)();
            await requestModalData(ideaID);
            changeButtonStatus({ isDisabled: false });
            changeDataVisible({ isVisible: true });
        });
    };

    // modal arrow handler
    const arrowHandler = async (event) => {
        event.preventDefault();
        const arrowButton = event.target;
        const isNext = arrowButton.classList.contains(`nextArrow`);
        const previousIdeaID = Number(ideaIDNode.value);
        const ideaID = (isNext) ? previousIdeaID + 1 : previousIdeaID - 1;
        // set disabled status to buttons && set load status
        await clearModalData();
        await requestModalData(ideaID);
        changeDataVisible({ isVisible: true });
    };

    // show idea modals on photo click
    ideaPhotos.forEach(showModal);

    // modal save button click
    if (saveButton) saveButton.addEventListener(`click`, saveIdea);

    // modal close button click
    if (closeButton) closeButton.addEventListener(`click`, clearModalData);

    // modal arrows
    modalArrows.forEach((arrowButton) => {
        arrowButton.addEventListener(`click`, arrowHandler);
    });

    // add mutationObserver for new albums add
    const observerOptions = { attributes: true, childList: true };
    const observerCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
            if (!mutation.addedNodes || !mutation.addedNodes.length) return false;
            if (!mutation.nextSibling) return false;
            mutation.addedNodes.forEach((ideaWrapper) => {
                const ideaPhoto = ideaWrapper.querySelector(`.ideaPhoto`);
                showModal(ideaPhoto);
            });
        });
    };
    const observer = new MutationObserver(observerCallback);
    if (ideaList) observer.observe(ideaList, observerOptions);

};