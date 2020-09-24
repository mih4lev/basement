const sharp = require('sharp');
const fs = require('fs-extra');

const imagesFolder = `public/upload/instagram/`;

const imageSizes = [
    [175, 175], [350, 350],
    [144, 144], [288, 288],
    [94, 94], [188, 188]
];

const saveCallback = (error) => {
    if (error) console.log(error);
};

const fetch = require('node-fetch');
const fetchImage = async ({ thumbnail }) => {
    const image = await fetch(thumbnail);
    const bufferData = await image.buffer();
    const randNum = Math.round(Math.random() * 10000000000000);
    imageSizes.forEach(({ 0: width, 1: height }) => {
        const fileName = randNum + `_` + width + `x` + height;
        sharp(bufferData)
            .resize(width, height)
            .toFile(imagesFolder + fileName + `.jpg`, saveCallback);
    });
};
// fetchImage();

const convertImages = async () => {
    const instagramData = await fs.readJson(`data-mock/instagram.json`);
    instagramData.forEach(fetchImage);
};

convertImages();