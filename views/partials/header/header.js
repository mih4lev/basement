export const headerMenu = () => {

    const headerNode = document.querySelector(`header`);
    const sandwichButton = document.querySelector(`.headerSandwichButton`);

    if (!headerNode) return false;

    const checkScrollVisible = () => {
        if (!headerNode.dataset.page) return false;
        const classAction = (window.pageYOffset > 0) ? `remove` : `add`;
        headerNode.classList[classAction](`transparentMenu`);
    };

    // update page header on scroll
    window.addEventListener(`scroll`, checkScrollVisible);
    checkScrollVisible();

    // sandwich button on <= 768px viewport
    if (sandwichButton) {
        sandwichButton.addEventListener(`click`, () => {
            const isMenuActive = headerNode.classList.contains(`activeMenu`);
            const classAction = (isMenuActive) ? `remove` : `add`;
            headerNode.classList[classAction](`activeMenu`);
            if (!isMenuActive) {
                headerNode.classList.remove(`transparentMenu`)
            } else {
                if (!headerNode.dataset.page) return false;
                const classAction = (window.pageYOffset > 0) ? `remove` : `add`;
                headerNode.classList[classAction](`transparentMenu`);
            }
        });
    }

    // links on <= 768px viewport
    const dropdownLinks = [...headerNode.querySelectorAll(`.dropdownMenuLink`)];
    const linkHandler = (link) => {
        link.addEventListener(`click`, () => {
            const isActive = link.parentNode.classList.contains(`activeDropdownLink`);
            const classAction = (isActive) ? `remove` : `add`;
            link.parentNode.classList[classAction](`activeDropdownLink`);
        });
    };
    dropdownLinks.forEach(linkHandler);

};