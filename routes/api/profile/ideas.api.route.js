const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const uploadDir = `public/upload/albums/`;
const imagesParser = multer({ dest: uploadDir });

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

const { saveImages } = require("../../../models/images.model");
const {
    createAlbum, createRelation, updateAlbum, deleteRelations
} = require("../../../models/albums.model");
const {
    requestUserIdeas, requestUploadIdeas, requestAlbumIdeas
} = require("../../../models/ideas.model");

// API /api/profile/ideas/save POST
router.post(`/save`, imagesParser.fields(albumsImages), async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { data: { userID }, body: { ideaID }} = request;
    let albumsArray = [];
    // if save to 1 album
    if (typeof request.body['savedAlbums'] === `string`) {
        albumsArray.push(request.body['savedAlbums']);
    }
    // if save to many albums
    if (typeof request.body['savedAlbums'] === `object`) {
        albumsArray = [...request.body['savedAlbums']];
    }
    // create new album
    if (request.body['albumTitle']) {
        const albumTitle = request.body['albumTitle'];
        const formData = { userID, albumTitle };
        const responseData = await createAlbum(formData);
        const { requestID } = responseData;
        if (request.files['albumCover']) {
            const files = await saveImages(albumsImages, request.files, requestID);
            const filesData = { ...files, ...{ albumID: requestID }};
            await updateAlbum(filesData);
        }
        albumsArray.push(String(requestID));
    }
    await deleteRelations(userID, ideaID);
    const savedRelations = [];
    for (const albumID of albumsArray) {
        const relationData = { userID, albumID, ideaID };
        const response = await createRelation(relationData);
        if (response.status === 1) savedRelations.push(response.requestID);
    }
    const status = (savedRelations.length === albumsArray.length) ? 1 : 0;
    const data = { status, savedRelations };
    setTimeout(() => response.json(data), 0);
});

// API /api/profile/ideas/saved/all GET
router.get(`/saved/all`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    const userID = request.data['userID'];
    const responseData = await requestUserIdeas(userID);
    setTimeout(() => response.json(responseData), 0);
});

// API /api/profile/ideas/saved/all GET
router.get(`/saved/album/:albumID`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { params: { albumID }} = request;
    const responseData = await requestAlbumIdeas(albumID);
    setTimeout(() => response.json(responseData), 0);
});

// API /api/profile/ideas/uploaded/all GET
router.get(`/uploaded/all`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    const userID = request.data['userID'];
    const responseData = await requestUploadIdeas(userID);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;