export const workImages = () => {
    const previewImages = [...document.querySelectorAll(`.previewImage`)];
    const workImage = document.querySelector(`.fullsizePicture`);
    const workLink = workImage.closest(`.fullsizePictureLink`);
    const loader = document.querySelector(`.fullsizeLoader`);
    if (workImage) {
        workImage.addEventListener(`load`, () => {
            loader.classList.add(`hiddenLoader`);
            workImage.classList.remove(`hiddenPicture`);
        });
    }
    const showImage = (event) => {
        const { target: { dataset: { picture }}} = event;
        workImage.classList.add(`hiddenPicture`);
        loader.classList.remove(`hiddenLoader`);
        setTimeout(() => {
            workImage.src = picture;
            workLink.setAttribute(`href`, picture);
            refreshFsLightbox();
        }, 500);
    };
    previewImages.forEach((previewImage) => {
        previewImage.addEventListener(`click`, showImage);
    });
    // set default image
    if (previewImages[0]) previewImages[0].click();
};