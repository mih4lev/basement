export const designCarousel = () => {
    // check page width
    const pageWidth = window.innerWidth;
    const reviewsWrapper = document.querySelector(`.designSection .carouselWrapper`);
    const cards = [...document.querySelectorAll(`.designWrapper .cardWrapper`)];
    const wrapperWidth = reviewsWrapper.scrollWidth;
    const reviewsArrows = [...document.querySelectorAll(`.designSection .carouselArrow`)];
    const cardWidth = (pageWidth >= 1440) ? 350 : (pageWidth >= 1000) ? 320 : (pageWidth >= 480) ? 285 : 204;
    // if (pageWidth >= 1000) reviewsWrapper.style.marginLeft = `${cardWidth}px`; // > 1000
    const wrapperOffset = () => {
        return Number((reviewsWrapper.style.marginLeft).replace(`px`, ``));
    };
    const setCardsVisible = (newValue = 0) => {
        const position = Math.abs(newValue / cardWidth);
        const setHiddenClass = (cardNode, index) => {
            const isVisible = (pageWidth >= 768 && pageWidth < 1000) ?
                (index >= position && index <= (position + 1)) :
                (index >= position && index <= position);
            const classAction = (isVisible) ? `remove` : `add`;
            cardNode.classList[classAction](`hiddenCard`);
        };
        cards.forEach(setHiddenClass);
    };
    if (pageWidth < 1000) setCardsVisible();
    const checkElementsVisible = (offsetValue) => {
        const previousAction = (offsetValue >= 0 && pageWidth >= 1000) ? `add` :
            (offsetValue >= 0 && pageWidth < 1000) ? `add` : `remove`;
        const nextAction = ((pageWidth >= 768) && (wrapperWidth + offsetValue <= (cardWidth * 3))) ? `add` :
            ((pageWidth < 768) && (wrapperWidth + offsetValue <= (cardWidth * 2))) ? `add` : `remove`;
        reviewsArrows[0].classList[previousAction](`hiddenArrow`);
        reviewsArrows[1].classList[nextAction](`hiddenArrow`);
    };
    const slideCards = (isNextArrow) => {
        const prevValue = wrapperOffset();
        // check for previous arrow click
        if ((pageWidth >= 1000) && (!isNextArrow && prevValue >= 0)) return false;
        if ((pageWidth < 1000) && (!isNextArrow && prevValue >= 0)) return false;
        const newValue = (isNextArrow) ? prevValue - cardWidth : prevValue + cardWidth;
        // check for next arrow click
        if ((pageWidth >= 768) && (isNextArrow && wrapperWidth + newValue < (cardWidth * 2))) return false;
        if ((pageWidth < 768) && (isNextArrow && (wrapperWidth + newValue < cardWidth))) return false;
        reviewsWrapper.style.marginLeft = `${newValue}px`;
        checkElementsVisible(newValue);
        if (pageWidth < 1000) setCardsVisible(newValue);
    };
    reviewsArrows.forEach((arrow) => {
        arrow.addEventListener(`click`, () => {
            const isNextArrow = arrow.classList.contains(`carouselRightArrow`);
            slideCards(isNextArrow);
        });
    });
    // touch actions
    let touchValue;
    const touchendHandler = (event) => {
        const offsetValue = touchValue - event.changedTouches[0].pageX;
        if (offsetValue >= 0 && offsetValue < 5) return false;
        // event.preventDefault();
        event.stopPropagation();
        const isNextArrow = (offsetValue > 0);
        slideCards(isNextArrow);
        reviewsWrapper.removeEventListener(`touchend`, touchendHandler);
    };
    const touchstartHandler = (event) => {
        touchValue = event.changedTouches[0].pageX;
        reviewsWrapper.addEventListener(`touchend`, touchendHandler);
    };
    reviewsWrapper.addEventListener(`touchstart`, touchstartHandler);
};