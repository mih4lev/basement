import { headerMenu } from "../../views/partials/header/header";

// webp checker
(function(){
    const canvas = document.createElement(`canvas`);
    let canUseWebp = false;
    if (!!(canvas.getContext && canvas.getContext(`2d`))) {
        canUseWebp = canvas.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0;
    }
    const htmlNode = document.querySelector(`html`);
    const action = (canUseWebp) ? `add` : `remove`;
    htmlNode.classList[action](`webp`);
})();

headerMenu();