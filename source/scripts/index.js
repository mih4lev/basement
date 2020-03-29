import { headerMenu } from "../../views/partials/header/header";

// webp checker
(function(){
    const canvas = document.createElement(`canvas`);
    let canUseWebp = false;
    if (!!(canvas.getContext && canvas.getContext(`2d`))) {
        canUseWebp = canvas.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0;
    }
    const htmlNode = document.querySelector(`html`);
    const webpClass = (canUseWebp) ? `webp` : `no-webp`;
    htmlNode.classList.add(webpClass);
})();

// temp func for title width
(function(){
    const titleNode = document.querySelector(`title`);
    const checkWidth = () => titleNode.innerText = `DEV ${window.innerWidth}`;
    window.addEventListener(`resize`, checkWidth);
    checkWidth();
})();

headerMenu();