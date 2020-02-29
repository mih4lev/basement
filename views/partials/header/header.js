export const headerMenu = () => {

    const headerNode = document.querySelector(`header`);
    if (!headerNode) return false;

    const sandwichButton = headerNode.querySelector(`.headerSandwichButton`);
    if (!sandwichButton) return false;
    sandwichButton.addEventListener(`click`, () => {
        const isMenuActive = headerNode.classList.contains(`activeMenu`);
        const classAction = (isMenuActive) ? `remove` : `add`;
        headerNode.classList[classAction](`activeMenu`);
    });

    const dropdownLinks = [...headerNode.querySelectorAll(`.dropdownMenuLink`)];
    if (!dropdownLinks.length) return false;
    dropdownLinks.forEach((link) => {
        const linkWrapper =  link.parentNode;
        link.addEventListener(`click`, () => {
            const isActive = linkWrapper.classList.contains(`activeDropdownLink`);
            const classAction = (isActive) ? `remove` : `add`;
            link.parentNode.classList[classAction](`activeDropdownLink`);
        });
    });

};