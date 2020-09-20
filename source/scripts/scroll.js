// change wrapper visible on scroll
const changeWrapperPosition = (wrapperNode, newValue) => {
    wrapperNode.style.marginTop = `-${newValue}px`;
    wrapperNode.offset = (newValue < 0) ? 0 : newValue;
}

// change scroll line visible on scroll
const updateLinePosition = (scrollNode, scrollValue) => {
    scrollNode.style.marginTop = `${scrollValue}px`;
    scrollNode.offset = (scrollValue < 0) ? 0 : scrollValue;
};

// create scroll line
const createScrollLine = (scrollHeight) => {
    const scrollLine = document.createElement(`div`);
    scrollLine.classList.add(`scrollLine`);
    scrollLine.style.height = `${scrollHeight}%`;
    return scrollLine;
}

// const scrollHandler = (scrollWrapper, isNext, movedValue) => {
//     // movedValue for check touch range
//     const childHeight = scrollWrapper.children[0].offsetHeight;
//     const previousValue = scrollWrapper.offset || 0;
//     const newValue = (isNext) ? previousValue + childHeight : previousValue - childHeight;
//     const maxScroll = (filtersCount - maxVisibleNodes) * childHeight;
//     // if scroll set to max position => return
//     if (newValue > maxScroll) return false;
//     changeWrapperPosition(newValue);
//     // hidden wrapper scroll
//     const scrollEmpty = (maxVisibleNodes * childHeight) - scrollLine.offsetHeight;
//     const scrollStep = scrollEmpty / (filtersCount - maxVisibleNodes);
//     const previousStep = scrollLine.offset || 0;
//     const scrollValue = (isNext) ? previousStep + scrollStep : previousStep - scrollStep;
//     // is scroll set to min position => return
//     if (scrollValue < -10) return false;
//     updateLinePosition(scrollValue);
// };

export const createScrollWrapper = (scrollWrapper, maxVisibleNodes) => {

    // height of wrapper item
    const childHeight = scrollWrapper.children[0].offsetHeight;
    // items length
    const filtersCount = scrollWrapper.children.length;
    // scroll line height
    const scrollHeight = (100 / filtersCount) * maxVisibleNodes;

    // check for max visible elements limit
    if (filtersCount < maxVisibleNodes) return false;

    // set max wrapper height
    const wrapperHeight = childHeight * maxVisibleNodes;
    scrollWrapper.parentNode.style.height = `${ wrapperHeight }px`;

    // wheel events
    const wheelHandler = (event) => {
        event.preventDefault();
        const isNext = event.deltaY > 0;
        // scrollHandler(isNext);
    };

    // touch events
    let startValue;
    const touchEndHandler = (event) => {
        const endedValue = event.changedTouches[0].pageY;
        const isNext = endedValue < startValue;
        const movedValue = endedValue - startValue;
        const isMove = (movedValue > 5 || movedValue + 5 < 0);
        // if (isMove) scrollHandler(isNext, movedValue);
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