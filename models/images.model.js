const sharp = require(`sharp`);
const fs = require(`fs-extra`);

const filesMAP = { 'jpeg': `.jpg`, 'png': `.png`, 'webp': `.webp` };

const chooseFormat = (promises, path, options) => {
    const { output, size, quality, name } = options;
    output.forEach((file) => {
        const outFile = `${name}${filesMAP[file]}`;
        promises.push(sharp(path).resize(size)[file](quality).toFile(outFile));
    });
};

const saveResizedImages = async (requestID, promises, file, sizes, output) => {
    const { filename, path, destination } = file;
    const collectPromises = async ({ 0: width, 1: height, 2: qualityValue }) => {
        const size = { width, height };
        const sizePrefix = (!width) ? `_100whx${height}` : (!height) ? `_${width}x100wh` :
                           (width && height) ? `_${width}x${height}` : ``;
        const name = destination + requestID + `/` + filename + sizePrefix;
        const quality = { quality: qualityValue };
        const options = { output, size, quality, name };
        chooseFormat(promises, path, options);
    };
    sizes.forEach(collectPromises);
};

const saveOriginalImage = async (requestID, promises, file, output) => {
    const { filename, path, destination } = file;
    const name = destination + requestID + `/` + filename;
    const size = {};
    const quality = { quality: 90 };
    const options = { output, size, quality, name };
    chooseFormat(promises, path, options);
};

const saveImages = async (images, files, requestID, removeFolder = true) => {
    const response = {};
    const promises = [];
    for ( const { name, sizes, output } of images ) {
        if (!files[name]) return false;
        const isSingle = files[name].length === 1;
        response[name] = [];
        for (const file of files[name]) {
            // check folder for save
            const dirName = file.destination + requestID;
            if (removeFolder) await fs.remove(dirName);
            await fs.ensureDir(dirName);
            // save every image of received data
            await saveOriginalImage(requestID, promises, file, output);
            await saveResizedImages(requestID, promises, file, sizes, output);
            await Promise.all(promises);
            // return full path of file
            const DBFilename = '/' + file.destination + requestID + `/` + file.filename;
            if (isSingle) response[name] = DBFilename;
            else response[name].push(DBFilename);
            // remove temp file
            fs.remove(`${file.destination}${file.filename}`);
        }
    }
    return response;
};

const deleteImages = async (requestID, uploadDir) => {
    const dirName = uploadDir + requestID;
    await fs.remove(dirName);
};

module.exports = { saveImages, deleteImages };