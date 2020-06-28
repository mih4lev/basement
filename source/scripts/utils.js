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