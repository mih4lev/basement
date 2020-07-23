export const middleCategories = () => {
    const categoriesWrapper = document.querySelector(`.categoriesCarousel`);
    if (!categoriesWrapper) return false;
    const pageWidth = window.innerWidth;
    const categoryList = categoriesWrapper.querySelector(`.categoryList`);
    const categoriesArrows = [...categoriesWrapper.querySelectorAll(`.sliderArrow`)];
    const categories = [...categoriesWrapper.querySelectorAll(`.categoryWrapper`)];
    const categoriesCount = categories.length;
    const wrapperWidth = categoryList.offsetWidth;
    const categoryWidth = (pageWidth >= 1440) ? 89 : (pageWidth >= 768) ? 82 : (pageWidth >= 480) ? 78 : 51;
    const wrapperOffset = () => {
        return Number((categoryList.style.marginLeft).replace(`px`, ``));
    };
    const checkElementsVisible = (offsetValue) => {
        const previousAction = (offsetValue >= 0) ? `add` : `remove`;
        const nextAction = (offsetValue + (categoriesCount * categoryWidth) - wrapperWidth <= 0) ? `add` : `remove`;
        categoriesArrows[0].classList[previousAction](`hiddenArrow`);
        categoriesArrows[1].classList[nextAction](`hiddenArrow`);
    };
    const slideCategories = (isNext) => {
        const prevValue = wrapperOffset();
        if (!isNext && (prevValue >= 0)) return false;
        const newValue = (isNext) ? prevValue - categoryWidth : prevValue + categoryWidth;
        if (newValue + (categoriesCount * categoryWidth) - wrapperWidth < 0) return false;
        categoryList.style.marginLeft = `${newValue}px`;
        checkElementsVisible(newValue);
    };
    categoriesArrows.forEach((categoryArrow) => {
        categoryArrow.addEventListener(`click`, () => {
            const isNext = categoryArrow.classList.contains(`nextSlide`);
            slideCategories(isNext);
        });
    });
    // touch actions
    let touchValue;
    const touchendHandler = (event) => {
        const offsetValue = touchValue - event.changedTouches[0].pageX;
        console.log(offsetValue);
        if (offsetValue >= 0 && offsetValue < 5) return false;
        // event.preventDefault();
        event.stopPropagation();
        const isNextArrow = (offsetValue > 0);
        slideCategories(isNextArrow);
        categoryList.removeEventListener(`touchend`, touchendHandler);
    };
    const touchstartHandler = (event) => {
        touchValue = event.changedTouches[0].pageX;
        categoryList.addEventListener(`touchend`, touchendHandler);
    };
    categoryList.addEventListener(`touchstart`, touchstartHandler);
};