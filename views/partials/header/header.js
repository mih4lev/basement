export const headerMenu = () => {
    // const headerNode = document.querySelector(`header`);
    // const sandwichButton = headerNode.querySelector(`.headerSandwichButton`);
    // sandwichButton.addEventListener(`click`, () => {
    //     const isMenuActive = headerNode.classList.contains(`activeMenu`);
    //     const classAction = (isMenuActive) ? `remove` : `add`;
    //     headerNode.classList[classAction](`activeMenu`);
    // });
    // const dropdownLinks = [...headerNode.querySelectorAll(`.dropdownMenuLink`)];
    // dropdownLinks.forEach((link) => {
    //     const linkWrapper =  link.parentNode;
    //     link.addEventListener(`click`, () => {
    //         const isActive = linkWrapper.classList.contains(`activeDropdownLink`);
    //         const classAction = (isActive) ? `remove` : `add`;
    //         const menuHeight = linkWrapper.querySelector(`.subMenuList`).offsetHeight;
    //         link.parentNode.classList[classAction](`activeDropdownLink`);
    //         link.parentNode.style.height = (isActive) ? `20px` : `${menuHeight + 35}px`;
    //     });
    // });

    const headerNode = document.querySelector(`header`);

    const sandwichButton = headerNode.querySelector(`.headerSandwichButton`);
    sandwichButton.addEventListener(`click`, () => {
        const isMenuActive = headerNode.classList.contains(`activeMenu`);
        const classAction = (isMenuActive) ? `remove` : `add`;
        headerNode.classList[classAction](`activeMenu`);
    });

    const dropdownLinks = [...headerNode.querySelectorAll(`.dropdownMenuLink`)];
    dropdownLinks.forEach((link) => {
        const linkWrapper =  link.parentNode;
        link.addEventListener(`click`, () => {
            const isActive = linkWrapper.classList.contains(`activeDropdownLink`);
            const classAction = (isActive) ? `remove` : `add`;
            link.parentNode.classList[classAction](`activeDropdownLink`);
        });
    });
};