import Swiper from 'swiper/bundle';

export const webpCheck = () => {
    const canvas = document.createElement(`canvas`);
    let canUseWebp = false;
    if (!!(canvas.getContext && canvas.getContext(`2d`))) {
        canUseWebp = canvas.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0;
    }
    const htmlNode = document.querySelector(`html`);
    const webpClass = (canUseWebp) ? `webp` : `no-webp`;
    htmlNode.classList.add(webpClass);
};

export const setButtonStatus = ({ button, isLoaded }) => {
    const classAction = (isLoaded) ? `remove` : `add`;
    button.classList[classAction](`loadButton`);
    if (!isLoaded) button.setAttribute(`disabled`, `disabled`);
    else button.removeAttribute(`disabled`);
};

export const saveAction = async (requestData) => {
    const { URL, method = `POST`, isJSON = false, body = {}, button, isShowLoaded = true } = requestData;
    setButtonStatus({ button: button, isLoaded: false });
    const JSONHeaders = { "Content-Type": "application/json" };
    const JSONOptions = { method, headers: JSONHeaders, body: JSON.stringify(body) };
    const formOptions = { method, body };
    const responseOptions = (isJSON) ? JSONOptions : formOptions;
    const response = await fetch(URL, responseOptions);
    const responseData = await response.json();
    if (isShowLoaded) setButtonStatus({ button: button, isLoaded: true });
    return responseData;
};

export const resetDropEvents = (elements) => {
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (eventName) => {
        return (event) => {
            event.preventDefault();
            const isHovered = (eventName === `dragenter` || eventName === `dragover`);
            const classAction = (isHovered) ? `add` : `remove`;
            event.target.classList[classAction](`dropOver`);
        };
    }
    dropEvents.forEach((eventName) => {
        elements.forEach((node) => {
            node.addEventListener(eventName, removeBrowserAPI(eventName));
        });
    });
};

export const createCustomEvent = (eventName, eventData = {}) => {
    const sendData = { detail: { data: eventData }};
    const customEvent = new CustomEvent(eventName, sendData);
    document.dispatchEvent(customEvent);
};

const createScrollLine = (scrollHeight) => {
    const scrollLine = document.createElement(`div`);
    scrollLine.classList.add(`scrollLine`);
    scrollLine.style.height = `${scrollHeight}%`;
    return scrollLine;
};

export const createScroll = (scrollWrapper, maxVisibleNodes) => {

    if (!scrollWrapper.children.length) return false;

    const childHeight = scrollWrapper.children[0].offsetHeight;
    const filtersCount = scrollWrapper.children.length;
    const scrollHeight = (100 / filtersCount) * maxVisibleNodes;

    if (filtersCount <= maxVisibleNodes) return false;

    // set max wrapper height
    scrollWrapper.parentNode.style.height = `${ childHeight * maxVisibleNodes }px`;

    // create scroll line
    const scrollLine = createScrollLine(scrollHeight);
    scrollWrapper.parentNode.appendChild(scrollLine);

    // change wrapper visible on scroll
    const changeWrapperPosition = (newValue) => {
        scrollWrapper.style.marginTop = `-${newValue}px`;
        scrollWrapper.offset = (newValue < 0) ? 0 : newValue;
    };

    // change scroll line visible on scroll
    const updateLinePosition = (scrollValue) => {
        scrollLine.style.marginTop = `${scrollValue}px`;
        scrollLine.offset = (scrollValue < 0) ? 0 : scrollValue;
    };

    const scrollHandler = (isNext, movedValue) => {
        // movedValue for check touch range
        const previousValue = scrollWrapper.offset || 0;
        const newValue = (isNext) ? previousValue + childHeight : previousValue - childHeight;
        const maxScroll = (filtersCount - maxVisibleNodes) * childHeight;
        // if scroll set to max position => return
        if (newValue > maxScroll) return false;
        changeWrapperPosition(newValue);
        // hidden wrapper scroll
        const scrollEmpty = (maxVisibleNodes * childHeight) - scrollLine.offsetHeight;
        const scrollStep = scrollEmpty / (filtersCount - maxVisibleNodes);
        const previousStep = scrollLine.offset || 0;
        const scrollValue = (isNext) ? previousStep + scrollStep : previousStep - scrollStep;
        // is scroll set to min position => return
        if (scrollValue < -10) return false;
        updateLinePosition(scrollValue);
    };

    // wheel events
    const wheelHandler = (event) => {
        event.preventDefault();
        const isNext = event.deltaY > 0;
        scrollHandler(isNext);
    };

    // touch events
    let startValue;
    const touchEndHandler = (event) => {
        const endedValue = event.changedTouches[0].pageY;
        const isNext = endedValue < startValue;
        const movedValue = endedValue - startValue;
        const isMove = (movedValue > 5 || movedValue + 5 < 0);
        if (isMove) scrollHandler(isNext, movedValue);
        scrollWrapper.removeEventListener(`touchend`, touchEndHandler);
    };
    const touchHandler = (event) => {
        event.preventDefault();
        startValue = event.changedTouches[0].pageY;
        scrollWrapper.addEventListener(`touchend`, touchEndHandler);
    };

    // add listeners
    scrollWrapper.addEventListener(`wheel`, wheelHandler);
    scrollWrapper.addEventListener(`touchstart`, touchHandler);
};

const showLoader = () => {
    const loaderNode = document.querySelector(`.pageLoader`);
    if (loaderNode) loaderNode.classList.remove(`hiddenLoader`);
};

const hideLoader = () => {
    const loaderNode = document.querySelector(`.pageLoader`);
    if (loaderNode) loaderNode.classList.add(`hiddenLoader`);
};

const showButton = () => {
    const buttonNode = document.querySelector(`.showMoreButton`);
    if (buttonNode) buttonNode.classList.remove(`hiddenButton`);
};

const hideButton = () => {
    const buttonNode = document.querySelector(`.showMoreButton`);
    if (buttonNode) buttonNode.classList.add(`hiddenButton`);
}

const hideSorting = () => {
    const sortingNode = document.querySelector(`.ideasSortWrapper`);
    if (sortingNode) sortingNode.classList.add(`hiddenWrapper`);
};

const showSorting = () => {
    const sortingNode = document.querySelector(`.ideasSortWrapper`);
    if (sortingNode) sortingNode.classList.remove(`hiddenWrapper`);
};

export const loader = (renderData) => {
    const buttonNode = document.querySelector(`.showMoreButton`);
    if (!buttonNode) return false;
    const { dataset: { scroll }} = buttonNode;
    buttonNode.addEventListener(`click`, showWorks(renderData));
    const intersectionCallback = (event) => {
        if (!event[0].isIntersecting) return false;
        showWorks(renderData)();
    };
    const observer = new IntersectionObserver(intersectionCallback);
    if (scroll && scroll === `1`) observer.observe(buttonNode);
    document.addEventListener(`listResponse`, () => {
        if (window.responseData.length === 0) {
            hideButton();
            hideSorting();
            return false;
        }
        showSorting();
    });
};

export const requestData = async (requestURL) => {
    const wrapper = document.querySelector(`.elementsWrapper`);
    const URL = requestURL || wrapper.dataset.api;
    const response = await fetch(URL);
    const data = await response.json();
    window.responseData = data[Object.keys(data)];
    document.dispatchEvent(new CustomEvent(`dataLoaded`, { detail: {}}));
};

const createLink = (nodeClone, { selector, title, link }) => {
    const linkNode = nodeClone.querySelector(selector);
    if (title) linkNode.innerText = title;
    linkNode.setAttribute(`href`, link);
};

const createPlug = (plug) => {
    const plugNode = document.createElement(`div`);
    plug.forEach((selector) => plugNode.classList.add(selector));
    return plugNode;
};

const createPicture = ({ alt, image, imageSize, selector, data, value }) => {
    const pictureNode = document.createElement(`picture`);
    imageSize.forEach(({ 0: media, 1: type, 2: normal, 3: retina }, index) => {
        const sourceNode = document.createElement(`source`);
        const source = image + normal + `, ` + image + retina + ` 2x`;
        sourceNode.setAttribute(`srcset`, source);
        sourceNode.setAttribute(`media`, media);
        sourceNode.setAttribute(`type`, type);
        pictureNode.appendChild(sourceNode);
        if (index === imageSize.length - 1) {
            const imageNode = document.createElement(`img`);
            imageNode.classList.add(selector);
            imageNode.setAttribute(`alt`, alt);
            imageNode.setAttribute(`srcset`, source);
            imageNode.setAttribute(`src`, image + normal);
            pictureNode.appendChild(imageNode);
            if (data) imageNode.dataset[data] = value;
        }
    });
    return pictureNode;
};

const createCover = (nodeClone, { parent, alt, image, imageSize, selector, plug, data, value }) => {
    const parentNode = nodeClone.querySelector(parent);
    const pictureData = { alt, image, imageSize, selector, data, value };
    const pictureNode = (image) ? createPicture(pictureData) : createPlug(plug);
    parentNode.appendChild(pictureNode);
};

const createText = (nodeClone, { selector, text }) => {
    const textNode = nodeClone.querySelector(selector);
    textNode.innerText = text;
};

const createData = (nodeClone, { selector, name, value, title }) => {
    const dataNode = nodeClone.querySelector(selector);
    if (title) dataNode.innerText = title;
    dataNode.dataset[name] = value;
};

const createCustom = (nodeClone, { selector, name, value, isVisible, isLogin }) => {
    const dataNode = nodeClone.querySelector(selector);
    if (isLogin === 0) {
        dataNode.removeAttribute(`data-` + name);
        dataNode.classList.replace(`saveIdea`, `userCreated`);
        dataNode.innerText = `SIGN IN TO SAVE`;
        return false;
    }
    if (isVisible) return dataNode.dataset[name] = value;
    // if user uploaded idea
    dataNode.removeAttribute(`data-` + name);
    dataNode.classList.replace(`saveIdea`, `userCreated`);
    dataNode.innerText = `CREATED BY YOU`;
};

const updateWrapper = (nodeClone, { wrapper, selector, data, value }) => {
    const wrapperNode = nodeClone.querySelector(wrapper)
    wrapperNode.classList.add(selector);
    wrapperNode.dataset[data] = value;
};

export const renderElements = (elements) => {
    const template = document.querySelector(`.elementTemplate`);
    const nodeClone = template.content.cloneNode(true);
    elements.forEach(({ type, ...data }) => {
        if (type === `wrapper`) updateWrapper(nodeClone, data)
        if (type === `link`) createLink(nodeClone, data);
        if (type === `picture`) createCover(nodeClone, data);
        if (type === `text`) createText(nodeClone, data);
        if (type === `data`) createData(nodeClone, data);
        if (type === `custom`) createCustom(nodeClone, data);
    });
    return nodeClone;
};

const updateData = (event, listWrapper) => {
    const { detail: { data }} = event;
    if (listWrapper) listWrapper.innerHTML = ``;
    window.responseData = data[Object.keys(data)];
    hideLoader();
};

const addChild = (listWrapper, renderCallback) => {
    const existCount = listWrapper.children.length;
    return (data, index) => {
        const { dataset: { page: maxCount }} = listWrapper;
        if (index < existCount || index > existCount - 1 + Number(maxCount)) return false;
        const element = renderElements(renderCallback(data));
        listWrapper.appendChild(element);
    }
};

const showWorks = (renderCallback) => {
    return (event) => {
        const listWrapper = document.querySelector(`.elementsWrapper`);
        if (event && event.detail && typeof event.detail === `object`) updateData(event, listWrapper);
        if (!listWrapper) return false;
        if (!window.responseData || window.responseData.length === 0) {
            return setTimeout(showWorks, 3000);
        }
        window.responseData.forEach(addChild(listWrapper, renderCallback));
        // show // hide more button
        const wrapperChild = listWrapper.children.length;
        (wrapperChild === 0 || window.responseData.length <= wrapperChild) ? hideButton() : showButton();
    }
};

export const filterEvents = (renderData) => {
    document.addEventListener(`listRequest`, showLoader);
    document.addEventListener(`listResponse`, showWorks(renderData));
};

export const topSlider = () => {
    new Swiper(`.swiper-container`, {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        }
    });
};