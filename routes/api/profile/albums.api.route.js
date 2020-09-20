const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const uploadDir = `public/upload/albums/`;
const imagesParser = multer({ dest: uploadDir });

const { saveImages, deleteImages } = require("../../../models/images.model");
const { createAlbum, updateAlbum, deleteAlbum } = require("../../../models/albums.model");

const albumsImages = [
    {
        name: `albumCover`,
        maxCount: 1,
        sizes: [
            [209, 209, 80],
            [137, 137, 80],
            [54, 54, 80],
            [41, 41, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// // API /api/profile/albums GET
// router.get(`/`, async (request, response) => {
//     const albumsMockJSON = fs.readFileSync(`data-mock/ideas-albums.json`);
//     const { albums } = await JSON.parse(albumsMockJSON);
//     await response.json(albums);
// });

// API /api/profile/albums POST
router.post(`/`, imagesParser.fields(albumsImages), async (request, response) => {
    const formData = { ...request.body };
    const responseData = await createAlbum(formData);
    const { requestID } = responseData;
    const files = await saveImages(albumsImages, request.files, requestID);
    const filesData = { ...files, ...{ albumID: requestID }};
    await updateAlbum(filesData);
    setTimeout(() => response.json(responseData), 1000);
});

// API /api/profile/albums/edit POST
router.post(`/edit`, imagesParser.fields(albumsImages), async (request, response) => {
    const { albumID } = request.body;
    const files = await saveImages(albumsImages, request.files, albumID);
    const formData = { ...request.body, ...files };
    const responseData = await updateAlbum(formData);
    setTimeout(() => response.json(responseData), 1000);
});

// API /api/profile/albums DELETE
router.delete(`/`, formParser.none(), async (request, response) => {
    const { albumID } = request.body;
    const responseData = await deleteAlbum(albumID);
    await deleteImages(albumID, uploadDir);
    setTimeout(() => response.json(responseData), 1000);
});

module.exports = router;