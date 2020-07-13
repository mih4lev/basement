import { saveAction } from "../../views/partials/modals/modals";

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

export const titleWidth = () => {
    const titleNode = document.querySelector(`title`);
    const checkWidth = () => titleNode.innerText = `DEV ${window.innerWidth}`;
    window.addEventListener(`resize`, checkWidth);
    checkWidth();
};

export const selectElements = () => {
    const selectElements = [...document.querySelectorAll(`.selectElement`)];
    selectElements.forEach((selectNode) => {
        const currentSelectData = selectNode.querySelector(`.currentSelectData`);
        const selectDataElements = [...selectNode.querySelectorAll(`.selectData`)];
        const hiddenField = selectNode.querySelector(`.hiddenField`);
        selectDataElements.forEach((selectData) => {
            selectData.addEventListener(`click`, () => {
                const { dataset: { select: chooseData }} = selectData;
                // remove empty data class && change select data
                currentSelectData.classList.remove(`emptyData`);
                currentSelectData.innerText = chooseData;
                // change active select element
                selectDataElements.forEach((selectData) => selectData.classList.remove(`selectedData`));
                selectData.classList.add(`selectedData`);
                // change hidden field value
                hiddenField.value = chooseData;
            });
        });
        selectNode.addEventListener(`click`, () => {
            const isSelectActive = selectNode.classList.contains(`activeSelectElement`);
            const classAction = (isSelectActive) ? `remove` : `add`;
            selectElements.forEach((selectElement) => selectElement.classList.remove(`activeSelectElement`));
            selectNode.classList[classAction](`activeSelectElement`);
        });
    });
};

export const contactForm = () => {
    const formNode = document.querySelector(`.contactFormWrapper`);
    const submitButton = formNode.querySelector(`.submitButton`);
    const textFields = [...formNode.querySelectorAll(`input[type="text"], textarea`)];
    const checkboxElements = [...formNode.querySelectorAll(`input[type="checkbox"]`)];
    const radioElements = [...formNode.querySelectorAll(`input[type="radio"]`)];
    const selectElements = [...formNode.querySelectorAll(`input[type="hidden"]`)];
    // show|hide labels
    textFields.forEach((field) => {
        const fieldLabel = field.parentNode.querySelector(`.fieldLabel`);
        const fieldHandler = (action = `add`) => {
            return () => {
                if (!field.value) fieldLabel.classList[action](`hiddenLabel`);
            }
        };
        field.addEventListener(`focus`, fieldHandler(`add`));
        field.addEventListener(`focusout`, fieldHandler(`remove`));
    });
    // submit listener
    const submitHandler = async (event) => {
        event.preventDefault();
        const body = new FormData(formNode);
        const responseData = await saveAction({ URL: `/api/contact`, body, button: submitButton });
        if (responseData.code !== 200) return false; // need show error
    };
    if (submitButton) submitButton.addEventListener(`click`, submitHandler);
    // check fields functions
    const radioChecked = `input[type="radio"]:checked`;
    const checkboxChecked = `input[type="checkbox"]:checked`;
    const isRadioChecked = () => !![...document.querySelectorAll(radioChecked)].length;
    const isCheckboxChecked = () => !![...document.querySelectorAll(checkboxChecked)].length;
    const validFieldsCount = () => textFields.filter((field) => !!field.value).length;
    const selectFieldsCount = () => selectElements.filter((field) => !!field.value).length;
    // progress line
    const progressLine = document.querySelector(`.progressLine`);
    const progressHandler = () => {
        const steps = Number(formNode.dataset.steps);
        let progress = validFieldsCount() + selectFieldsCount();
        if (isRadioChecked()) progress += 1;
        if (isCheckboxChecked()) progress += 1;
        progressLine.style.width = (progress === steps) ? `100%` : `${(100 / steps) * progress}%`;
    };
    // add fields listeners
    textFields.forEach((field) => field.addEventListener(`input`, progressHandler));
    checkboxElements.forEach((checkbox) => checkbox.addEventListener(`change`, progressHandler));
    radioElements.forEach((radio) => radio.addEventListener(`change`, progressHandler));
    // mutationObserver for hidden elements
    const mutationObserver = new MutationObserver(progressHandler);
    selectElements.forEach((selectElement) => {
        mutationObserver.observe(selectElement, { attributes: true });
    });
};

export const instantQuoteForm = () => {

};

export const filters = () => {
    const chosenWrapper = document.querySelector(`.activeFilterList`);
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
    // filters scroll
    const maxFiltersValue = 8;
    const filterWrappers = [...document.querySelectorAll(`.hiddenFilters`)];
    filterWrappers.forEach((filterWrapper) => {
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
            filtersParent.addEventListener(`wheel`, (event) => {
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
            });
        }
        // add filter to visible list
        const removeFilter = (filterNode) => {
            console.log(`remove`);
            console.log(filterNode);
        };
        const addFilter = (filterNode) => {
            const { dataset: { filter, title }} = filterNode;
            const createdNode = document.createElement(`li`);
            createdNode.classList.add(`activeFilter`);
            createdNode.innerText = title;
            const removeButton = document.createElement(`button`);
            removeButton.classList.add(`removeFilterButton`);
            removeButton.innerText = `X`;
            removeButton.addEventListener(`click`, () => removeFilter(filterNode));
            createdNode.appendChild(removeButton);
            chosenWrapper.appendChild(createdNode);
            console.log(`add`);
            console.log(filterNode);
        };
        // filter click
        const selectNodes = [...filterWrapper.querySelectorAll(`.hiddenFilter`)];
        selectNodes.forEach((selectNode) => {
            selectNode.addEventListener(`click`, () => {
                const isActive = selectNode.classList.contains(`activeHiddenFilter`);
                const classAction = (isActive) ? `remove` : `add`;
                const chooseHandler = (isActive) ? removeFilter : addFilter;
                selectNode.classList[classAction](`activeHiddenFilter`);
                chooseHandler(selectNode);
            });
        });
        console.log(selectNodes);
    });
};