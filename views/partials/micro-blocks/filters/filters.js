import { createCustomEvent } from "../../../../source/scripts/utils";

// collect data from filters and send them to API
const collectFiltersData = async () => {
    const formNode = document.querySelector(`.filtersForm`);
    const URL = formNode.getAttribute(`action`);
    const formData = new FormData(formNode);
    const sendOptions = { method: `POST`, body: formData };
    createCustomEvent(`listRequest`);
    const response = await fetch(URL, sendOptions);
    const responseData = await response.json();
    // console.log(responseData);
    // create customEvent
    createCustomEvent(`listResponse`, responseData.data);
};

// check chosen filter && set them wrapper .emptyChosenFilters class
const checkChosenFilters = () => {
    const filtersWrapper = document.querySelector(`.chosenFiltersWrapper .wrapper`);
    const chosenList = document.querySelector(`.activeFilterList`);
    const hasChosen = !!chosenList.children.length;
    const invertClassAction = (hasChosen) ? `remove` : `add`;
    filtersWrapper.classList[invertClassAction](`emptyChosenFilters`);
}

// check chosen filters
const checkFilters = (filterNode) => {
    const innerFilters = [...filterNode.querySelectorAll(`.hiddenFilter`)];
    const filterFunc = (filter) => filter.classList.contains(`activeHiddenFilter`);
    const isExistChosen = !!innerFilters.filter(filterFunc).length;
    const classAction = (isExistChosen) ? `add` : `remove`;
    filterNode.classList[classAction](`chosenFilter`);
    // add / remove empty class wrapper
    checkChosenFilters();
    // collect formData
    collectFiltersData();
};

// add filter to chosen list
const removeFilter = (filterNode) => {
    const { dataset: { title, filter }} = filterNode;
    const chosenWrapper = document.querySelector(`.activeFilterList`);
    const removeSelector = `.activeFilter[data-title="${title}"][data-filter="${filter}"]`;
    const removedNode = document.querySelector(removeSelector);
    chosenWrapper.removeChild(removedNode);
    filterNode.classList.remove(`activeHiddenFilter`);
    // check chosen filters
    const dropdownFilter = filterNode.closest(`.dropdownFilter`);
    checkFilters(dropdownFilter);
};

// remove filter from chosen list
const addFilter = (filterNode) => {
    const { dataset: { filter, title }} = filterNode;
    const chosenWrapper = document.querySelector(`.activeFilterList`);
    const createdNode = document.createElement(`li`);
    createdNode.classList.add(`activeFilter`);
    createdNode.innerText = title;
    createdNode.dataset.title = title;
    createdNode.dataset.filter = filter;
    const removeButton = document.createElement(`button`);
    removeButton.classList.add(`removeFilterButton`);
    removeButton.innerText = `X`;
    removeButton.addEventListener(`click`, () => removeFilter(filterNode));
    createdNode.appendChild(removeButton);
    // add hidden field with data
    const createdField = document.createElement(`input`);
    createdField.setAttribute(`value`, title);
    createdField.setAttribute(`name`, filter);
    createdField.setAttribute(`type`, `hidden`);
    createdNode.appendChild(createdField);
    // add created node to chosen filter list
    chosenWrapper.appendChild(createdNode);
    // check chosen filters
    const dropdownFilter = filterNode.closest(`.dropdownFilter`);
    checkFilters(dropdownFilter);
};

// dropdown filter click handler
const filterClickHandler = (selectNode) => {
    return () => {
        const isActive = selectNode.classList.contains(`activeHiddenFilter`);
        const classAction = (isActive) ? `remove` : `add`;
        const chooseHandler = (isActive) ? removeFilter : addFilter;
        selectNode.classList[classAction](`activeHiddenFilter`);
        chooseHandler(selectNode);
    }
};

const changeDropdownVisible = (dropdownLink) => {
    return () => {
        const dropdownLinks = [...document.querySelectorAll(`.dropdownFilter`)];
        const isActive = dropdownLink.classList.contains(`activeFilter`);
        const classAction = (isActive) ? `remove` : `add`;
        // unset active dropdown menu
        dropdownLinks.forEach((link) => link.classList.remove(`activeFilter`));
        dropdownLink.classList[classAction](`activeFilter`);
    }
};

const maxFiltersValue = 8;
const createDropdownFilters = (filterWrapper) => {
    const filtersParent = filterWrapper.parentNode;
    const filtersCount = filterWrapper.children.length;
    const scrollHeight = (100 / filtersCount) * maxFiltersValue;
    const childHeight = filterWrapper.children[0].offsetHeight;
    // exist more then maxFiltersValue filters
    if (filtersCount > maxFiltersValue) {
        // create scroll line
        const scrollNode = document.createElement(`div`);
        scrollNode.classList.add(`scrollLine`);
        scrollNode.style.height = `${scrollHeight}%`;
        filtersParent.appendChild(scrollNode);
        // set max wrapper height
        filtersParent.style.height = `${ childHeight * maxFiltersValue }px`;
        // add scrollListeners
        const dropdownScrollHandler = (isNext, movedValue) => {
            // movedValue for check touch range
            const previousValue = filterWrapper.offset || 0;
            const newValue = (isNext) ? previousValue + childHeight : previousValue - childHeight;
            const maxScroll = (filtersCount - maxFiltersValue) * childHeight;
            if (newValue > maxScroll) return false;
            filterWrapper.style.marginTop = `-${newValue}px`;
            filterWrapper.offset = (newValue < 0) ? 0 : newValue;
            // hidden wrapper scroll
            const scrollEmpty = (maxFiltersValue * childHeight) - scrollNode.offsetHeight;
            const scrollStep = scrollEmpty / (filtersCount - maxFiltersValue);
            const previousScrollStep = scrollNode.offset || 0;
            const scrollValue = (isNext) ? previousScrollStep + scrollStep : previousScrollStep - scrollStep;
            if (scrollValue < -10) return false;
            scrollNode.style.marginTop = `${scrollValue}px`;
            scrollNode.offset = (scrollValue < 0) ? 0 : scrollValue;
        };
        filtersParent.addEventListener(`wheel`, (event) => {
            event.preventDefault();
            const isNext = event.deltaY > 0;
            dropdownScrollHandler(isNext);
        });
        // add touch events
        let startValue;
        const touchEndHandler = (event) => {
            const endedValue = event.changedTouches[0].pageY;
            const isNext = endedValue < startValue;
            const movedValue = endedValue - startValue;
            dropdownScrollHandler(isNext, movedValue);
            filterWrapper.removeEventListener(`touchend`, touchEndHandler);
        };
        const touchStartHandler = (event) => {
            event.preventDefault();
            startValue = event.changedTouches[0].pageY;
            filterWrapper.addEventListener(`touchend`, touchEndHandler);
        };
        filterWrapper.addEventListener(`touchstart`, touchStartHandler);
    }
    // filter click
    const selectNodes = [...filterWrapper.querySelectorAll(`.hiddenFilter`)];
    selectNodes.forEach((selectNode) => {
        selectNode.addEventListener(`click`, filterClickHandler(selectNode));
        selectNode.addEventListener(`touchstart`, (event) => {
            const startValue = event.changedTouches[0].pageY;
            const touchEndHandler = (event) => {
                const endedValue = event.changedTouches[0].pageY;
                if (startValue - endedValue >= 5 || endedValue - startValue >= 5) return false;
                const dropdownFilter = selectNode.closest(`.dropdownFilter`);
                filterClickHandler(selectNode)();
                changeDropdownVisible(dropdownFilter)();
                selectNode.removeEventListener(`touchend`, touchEndHandler);
            };
            selectNode.addEventListener(`touchend`, touchEndHandler);
        });
    });
};

const createHiddenField = (clickLink) => {
    const { dataset: { filter, value }} = clickLink;
    const hiddenFieldNode = document.createElement(`input`);
    hiddenFieldNode.classList.add(`hiddenField`);
    hiddenFieldNode.setAttribute(`type`, `hidden`);
    hiddenFieldNode.setAttribute(`name`, filter);
    hiddenFieldNode.setAttribute(`value`, value);
    return hiddenFieldNode;
};

export const filters = () => {
    // show/hide dropdown filters
    const dropdownLinks = [...document.querySelectorAll(`.dropdownFilter`)];
    dropdownLinks.forEach((dropdownLink) => {
        dropdownLink.addEventListener(`click`, changeDropdownVisible(dropdownLink));
    });
    // create dropdown filter windows
    const filterWrappers = [...document.querySelectorAll(`.hiddenFilters`)];
    filterWrappers.forEach(createDropdownFilters);
    // click filters
    const clickFilters = [...document.querySelectorAll(`.clickFilter`)];
    clickFilters.forEach((clickFilter) => {
        clickFilter.addEventListener(`click`, () => {
            const isActive = clickFilter.classList.contains(`activeFilter`);
            const classAction = (isActive) ? `remove` : `add`;
            clickFilter.classList[classAction](`activeFilter`);
            // add hidden value
            let hiddenFieldNode = clickFilter.querySelector(`.hiddenField`);
            if (!hiddenFieldNode) hiddenFieldNode = createHiddenField(clickFilter);
            const childAction = (!isActive) ? `appendChild` : `removeChild`;
            clickFilter[childAction](hiddenFieldNode);
            // send data
            collectFiltersData();
        });
    });
    // range filter
    const rangeFilters = [...document.querySelectorAll(`.rangeFilter`)];
    rangeFilters.forEach((rangeFilter) => {
        const rangeWrapper = rangeFilter.querySelector(`.rangeWrapper`);
        const rangeLine = rangeFilter.querySelector(`.rangeLine`);
        const rangeButtons = [...rangeFilter.querySelectorAll(`.rangeButton`)];
        const rangeSingleTitles = [...rangeFilter.querySelectorAll(`.rangeSingleTitle`)];
        const minValueNodes = [...rangeFilter.querySelectorAll(`.minValue`)];
        const maxValueNodes = [...rangeFilter.querySelectorAll(`.maxValue`)];
        const rangeTwinTitles = rangeFilter.querySelector(`.rangeTwinTitle`);
        const formNode = document.querySelector(`.filtersForm`);
        const setTitlesVisible = () => {
            const minTitleOffset = rangeSingleTitles[0].getBoundingClientRect().left;
            const minTitleWidth = rangeSingleTitles[0].clientWidth;
            const maxTitleOffset = rangeSingleTitles[1].getBoundingClientRect().left;
            const isSinglesVisible = (minTitleOffset + minTitleWidth) < maxTitleOffset;
            const showSingles = (title) => title.style.opacity = String((isSinglesVisible) ? 1 : 0);
            rangeSingleTitles.forEach(showSingles);
            rangeTwinTitles.style.opacity = String((!isSinglesVisible) ? 1 : 0);
        };
        const createField = (fieldSelector) => {
            const createdNode = document.createElement(`input`);
            createdNode.classList.add(fieldSelector);
            createdNode.setAttribute(`name`, `square`);
            createdNode.setAttribute(`type`, `hidden`);
            formNode.appendChild(createdNode);
            return createdNode;
        };
        const updateHiddenField = (currentMin, currentMax) => {
            // check hidden value exist
            const minField = formNode.querySelector(`.minHiddenField`) ||
                             createField(`minHiddenField`);
            const maxField = formNode.querySelector(`.maxHiddenField`) ||
                             createField(`maxHiddenField`);
            minField.setAttribute(`value`, currentMin);
            maxField.setAttribute(`value`, currentMax);
        };
        const setRange = () => {
            const { dataset: { min, max, currentMin, currentMax }} = rangeLine;
            const wrapperWidth = rangeWrapper.offsetWidth;
            const lineOffset = (currentMin === min) ? 0 : wrapperWidth * (currentMin / max);
            const lineWidth = (wrapperWidth * (currentMax / max)) - lineOffset;
            rangeLine.style.left = `${ lineOffset }px`;
            rangeLine.style.width = `${ lineWidth }px`;
            // set titles visible
            setTitlesVisible();
            // add || update filters
            updateHiddenField(currentMin, currentMax);
        };
        setRange();
        const rangeHandler = (rangeNode) => {
            const isMinButton = rangeNode.classList.contains(`rangeMinValue`);
            let startValue;
            const mouseMoveHandler = (event) => {
                const eventValue = event.pageX || event.targetTouches[0].pageX;
                const { dataset: { min, max, currentMin, currentMax }} = rangeLine;
                const wrapperWidth = rangeWrapper.offsetWidth;
                const rangeStep = rangeLine.dataset.max / wrapperWidth;
                // check offset
                const oldValue = (isMinButton) ? Number(currentMin) : Number(currentMax);
                const rangeMove = eventValue - startValue;
                const newValue = oldValue + (rangeMove * rangeStep);
                //
                if (isMinButton && newValue >= currentMax) return false;
                if (!isMinButton && newValue <= currentMin) return false;
                // change button visible
                const changeValue = (newValue <= min) ? min : (newValue >= max) ? max : newValue;
                const currentValue = (isMinButton) ? `currentMin` : `currentMax`;
                rangeLine.dataset[currentValue] = String(Math.floor(changeValue));
                startValue = eventValue;
                // set values
                const setValue = (valueNode) => valueNode.innerText = Math.floor(changeValue);
                const valuesNode = (isMinButton) ? minValueNodes : maxValueNodes;
                valuesNode.forEach(setValue);
                setRange();
            };
            const mouseUpHandler = () => {
                document.removeEventListener(`mousemove`, mouseMoveHandler);
                document.removeEventListener(`mouseup`, mouseUpHandler);
                collectFiltersData();
            };
            const mouseDownHandler = (event) => {
                startValue = event.pageX;
                document.addEventListener(`mousemove`, mouseMoveHandler);
                document.addEventListener(`mouseup`, mouseUpHandler);
            };
            rangeNode.addEventListener(`mousedown`, mouseDownHandler);
            //
            const touchEndHandler = () => {
                document.removeEventListener(`touchmove`, mouseMoveHandler);
                document.removeEventListener(`touchend`, mouseUpHandler);
                collectFiltersData();
            };
            const touchStartHandler = (event) => {
                startValue = event.targetTouches[0].pageX;
                document.addEventListener(`touchmove`, mouseMoveHandler);
                document.addEventListener(`touchend`, touchEndHandler);
            };
            rangeNode.addEventListener(`touchstart`, touchStartHandler, false);
        };
        window.addEventListener(`resize`, setRange);
        rangeButtons.forEach(rangeHandler);
    });
};