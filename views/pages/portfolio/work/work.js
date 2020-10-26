export const workImages = () => {
    const previewImages = [...document.querySelectorAll(`.previewImage`)];
    const previewLinks = [...document.querySelectorAll(`.previewLink`)];
    const workImage = document.querySelector(`.fullsizePicture`);
    const loader = document.querySelector(`.fullsizeLoader`);
    if (workImage) {
        workImage.addEventListener(`load`, () => {
            loader.classList.add(`hiddenLoader`);
            workImage.classList.remove(`hiddenPicture`);
        });
    }
    const checkPreviewClasses = (clickedNode) => {
        previewLinks.forEach((previewLink) => {
            const previewImage = previewLink.parentNode.querySelector(`.previewImage`);
            previewLink.setAttribute(`href`, previewImage.dataset.picture);
            previewLink.dataset.fslightbox = `gallery`;
        });
        const currentParent = clickedNode.closest(`.previewWrapper`);
        const currentPreviewLink = currentParent.querySelector(`.previewLink`);
        currentPreviewLink.removeAttribute(`href`);
        currentPreviewLink.removeAttribute(`data-fslightbox`);
    };
    const showImage = (event) => {
        const { target: { dataset: { picture }}, target: clickedNode } = event;
        const workLink = workImage.closest(`.fullsizePictureLink`);
        workImage.classList.add(`hiddenPicture`);
        loader.classList.remove(`hiddenLoader`);
        setTimeout(() => {
            workImage.src = picture;
            workLink.setAttribute(`href`, picture);
            checkPreviewClasses(clickedNode);
            refreshFsLightbox();
        }, 500);
    };
    previewImages.forEach((previewImage) => {
        previewImage.addEventListener(`click`, showImage);
    });
    // set default image
    if (previewImages[0]) previewImages[0].click();
};