// collect data from filters and send them to API
const collectFiltersData = async () => {
    const formNode = document.querySelector(`.filtersForm`);
    const URL = formNode.getAttribute(`action`);
    const formData = new FormData(formNode);
    const sendOptions = { method: `POST`, body: formData };
    const response = await fetch(URL, sendOptions);
    const responseData = await response.json();
    console.log(responseData);
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
        const dropdownScrollHandler = (event) => {
            event.preventDefault();
            const isNext = event.deltaY > 0;
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
        filtersParent.addEventListener(`wheel`, dropdownScrollHandler);
    }
    // filter click
    const selectNodes = [...filterWrapper.querySelectorAll(`.hiddenFilter`)];
    selectNodes.forEach((selectNode) => {
        selectNode.addEventListener(`click`, filterClickHandler(selectNode));
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
    // show/hide filters
    const dropdownLinks = [...document.querySelectorAll(`.dropdownFilter`)];
    dropdownLinks.forEach((dropdownLink) => {
        dropdownLink.addEventListener(`click`, () => {
            const isActive = dropdownLink.classList.contains(`activeFilter`);
            const classAction = (isActive) ? `remove` : `add`;
            // unset active dropdown menu
            dropdownLinks.forEach((link) => link.classList.remove(`activeFilter`));
            dropdownLink.classList[classAction](`activeFilter`);
        });
    });
    const clickLinks = [...document.querySelectorAll(`.clickFilter`)];
    clickLinks.forEach((clickLink) => {
        clickLink.addEventListener(`click`, () => {
            const isActive = clickLink.classList.contains(`activeFilter`);
            const classAction = (isActive) ? `remove` : `add`;
            clickLink.classList[classAction](`activeFilter`);
            // add hidden value
            let hiddenFieldNode = clickLink.querySelector(`.hiddenField`);
            if (!hiddenFieldNode) hiddenFieldNode = createHiddenField(clickLink);
            const childAction = (!isActive) ? `appendChild` : `removeChild`;
            clickLink[childAction](hiddenFieldNode);
            // send data
            collectFiltersData();
        });
    });
    // create dropdown filter windows
    const filterWrappers = [...document.querySelectorAll(`.hiddenFilters`)];
    filterWrappers.forEach(createDropdownFilters);
};