import { changeModalVisible, setModal } from "../modals";
import { saveAction } from "../../../../source/scripts/utils";

export const viewIdeaModal = () => {

    const animationTimeout = 250;

    const modalNode = setModal(`view-idea`);
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
    const authorNode = modalNode.querySelector(`.ideaAuthor`);
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
                authorNode.innerText = ``;
                countWrapper.innerText = ``;
                ideaLink.innerText = ``;
                ideaLink.removeAttribute(`href`);
                ideaLabelList.innerHTML = ``;
                otherPreviewList.innerHTML = ``;
                saveButton.dataset.idea = ``;
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
    const createTagList = (tags) => {
        ideaLabelList.innerHTML = ``;
        tags.forEach((tagName) => {
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
    const createPreviewList = (similar) => {
        otherPreviewList.innerHTML = ``;
        similar.forEach(({ ideaID, ideaTitle, ideaImage }) => {
            // li
            const previewNode = document.createElement(`li`);
            previewNode.classList.add(`otherPreviewWrapper`);
            previewNode.dataset.idea = ideaID;
            // img
            const previewPicture = document.createElement(`img`);
            previewPicture.classList.add(`otherPreview`);
            previewPicture.src = ideaImage + `_154x154.jpg`;
            previewPicture.setAttribute(`alt`, ideaTitle);
            // append
            previewNode.appendChild(previewPicture);
            otherPreviewList.appendChild(previewNode);
        });
        // preview thumbs click handler
        [...otherPreviewList.children].forEach((thumb) => {
            thumb.addEventListener(`click`, async () => {
                const { dataset: { idea: ideaID }} = thumb;
                const modalNode = document.querySelector(`[data-modal="view-idea"]`);
                const modalWrapper = modalNode.querySelector(`.contentWrapper`);
                modalWrapper.classList.add(`showLoadStatus`);
                await requestModalData(ideaID);
                modalWrapper.classList.remove(`showLoadStatus`);
            });
        });
    };

    const selectModalPicture = ({ ideaImage, ideaTitle }) => {
        const pictureFormat = selectPictureFormat();
        ideaModalPhoto.src = ideaImage + `.jpg`;
        ideaModalPhoto.setAttribute(`title`, ideaTitle);
    };

    const changeButtonVisible = (ideaID, isVisible, isLogin) => {
        if (isLogin === 0) {
            const title = `Sign in to save`;
            saveButton.setAttribute(`title`, title);
            saveButton.innerText = title;
            saveButton.classList.remove(`userIdea`);
            saveButton.classList.add(`unLoginIdea`);
            return false;
        }
        const title = (isVisible) ? `Save to collection` : `Created by you`;
        const userAction = (isVisible) ? `remove` : `add`;
        const saveAction = (isVisible) ? `add` : `remove`;
        saveButton.dataset.idea = (isVisible) ? ideaID : ``;
        saveButton.setAttribute(`title`, title);
        saveButton.innerText = title;
        saveButton.classList[userAction](`userIdea`);
        saveButton.classList[saveAction](`saveIdea`);
    };

    // set requested data to modal
    const setModalData = (responseData) => {
        const {
            ideaID, ideaTitle, ideaAuthor, ideaImage, saveCount, prevID, nextID,
            categories, filters, isVisible, isLogin
        } = responseData;
        const { 0: { categoryTitle, categoryLink, similar }} = categories;
        // set data to modal
        ideaIDNode.value = ideaID;
        sectionTitle.innerText = ideaTitle;
        authorNode.innerText = ideaAuthor;
        countWrapper.innerText = saveCount;
        // button
        changeButtonVisible(ideaID, isVisible, isLogin);
        // category
        ideaLink.innerText = categoryTitle;
        ideaLink.setAttribute(`href`, categoryLink);
        // arrows
        modalArrows[0].dataset.idea = nextID;
        modalArrows[1].dataset.idea = prevID;
        // create tag list
        createTagList(filters);
        // create thumbs list
        createPreviewList(similar);
        selectModalPicture({ ideaImage, ideaTitle });
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

    // save idea to profile DB
    const saveIdea = (event) => {
        event.preventDefault();
    };

    // show idea modal
    const showModal = (ideaPhoto) => {
        ideaPhoto.addEventListener(`click`, async () => {
            const { dataset: { idea: ideaID }} = ideaPhoto;
            changeModalVisible(modalNode)();
            await requestModalData(ideaID);
            changeDataVisible({ isVisible: true });
        });
    };

    // modal arrow handler
    const arrowHandler = async (event) => {
        event.preventDefault();
        const { dataset: { idea: ideaID }} = event.target;
        await clearModalData();
        await requestModalData(ideaID);
        changeDataVisible({ isVisible: true });
    };

    // show idea modals on photo click
    ideaPhotos.forEach(showModal);

    // observe new elements
    const callback = (mutationsList) => {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!node.classList || !node.classList.contains(`ideaWrapper`)) return false;
                const saveButton = [...node.querySelectorAll(`.ideaPhoto`)];
                saveButton.forEach(showModal);
            });
        });
    };
    const ideasObserver = new MutationObserver(callback);
    if (ideaList) ideasObserver.observe(ideaList, { childList: true });

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