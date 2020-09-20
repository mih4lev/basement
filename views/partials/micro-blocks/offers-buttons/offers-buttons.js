export const offersIcons = () => {
    const offers = [...document.querySelectorAll(`.offerList .offerWrapper`)];
    const deactivateAllOffers = () => {
        offers.forEach((offer) => offer.classList.remove(`activeOffer`));
    };
    const setOffer = (offerNode, index) => {
        return () => {
            deactivateAllOffers();
            offerNode.classList.add(`activeOffer`);
            sessionStorage.setItem(`offer`, String(index));
        };
    };
    offers.forEach((offer, index) => offer.addEventListener(`click`, setOffer(offer, index)));
    // set sessionStorage offer
    const sessionValue = sessionStorage.getItem(`offer`);
    if (sessionValue) setOffer(offers[sessionValue], Number(sessionValue))();
};