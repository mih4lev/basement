const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const uploadDir = `public/upload/custom/`;
const imagesParser = multer({ dest: uploadDir });
const { saveImages } = require("../../models/images.model");

const {
    saveUploadImage, updateUploadImage
} = require("../../models/upload.model");

const uploadImages = [
    {
        name: `uploadImage`,
        maxCount: 1
    }
];

// CREATE

router.post(`/`, imagesParser.fields(uploadImages), async (request, response, next) => {
    try {
        if (!request.data['userID'] || !request.data['isAdmin']) return next();
        const { imageWidth, imageHeight } = request.body;
        const formData = { ...request.body };
        const responseData = await saveUploadImage(formData);
        const { requestID } = responseData
        // save uploaded settings
        const mimetype = request.files['uploadImage'][0].mimetype;
        const fileType = (mimetype === `image/jpeg`) ? `jpeg` : `png`;
        uploadImages[0]['sizes'] = [[Number(imageWidth), Number(imageHeight), 80]];
        uploadImages[0]['output'] = [fileType, `webp`];
        const files = await saveImages(uploadImages, request.files, requestID);
        const filesData = { ...files, ...{ uploadID: requestID }};
        const imageType = (fileType === `jpeg`) ? `jpg` : `png`;
        const link = files['uploadImage'] + `_${imageWidth}x${imageHeight}.${imageType}`;
        await updateUploadImage(filesData);
        setTimeout(() => response.json({ ...responseData, link }), 1000);
    } catch (error) {
        const responseData = { status: 0 };
        setTimeout(() => response.json(responseData), 1000);
    }
});

module.exports = router;