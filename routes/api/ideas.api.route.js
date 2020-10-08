const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const uploadDir = `public/upload/ideas/`;
const imagesParser = multer({ dest: uploadDir });

const { saveImages, deleteImages } = require("../../models/images.model");
const {
    requestIdeas, requestModeratedIdeas, requestIdea, requestFilteredIdeas,
    requestCategoryIdeasByID, requestNewIdeas, requestCategoryFilteredIdeasByID,
    createIdea, updateIdea, deleteIdea
} = require("../../models/ideas.model");
const { requestSavedAlbums, deleteRelations } = require("../../models/albums.model");

const ideasImages = [
    {
        name: `ideaImage`,
        maxCount: 100,
        sizes: [
            [252, 252, 80],
            [504, 504, 80],
            [154, 154, 80],
            [308, 308, 80],
            [71, 71, 80],
            [142, 142, 80],
            [44, 44, 80],
            [88, 88, 80],
            [, 408, 80],
            [, 816, 80],
            [, 204, 80],
            [, 408, 80],
            [, 130, 80],
            [, 260, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// API /api/ideas - POST | add ideas from profile (multiple)
router.post(`/`, imagesParser.fields(ideasImages), async (request, response, next) => {
    if (!request.data['userID']) return next();
    const formData = { ...request.body };
    const ideasArray = [];
    for (const file of request.files['ideaImage']) {
        const { filename } = file;
        const responseData = await createIdea(formData);
        const { requestID } = responseData;
        const sendFile = { 'ideaImage': [ file ]};
        ideasArray.push({ requestID, filename });
        const files = await saveImages(ideasImages, sendFile, requestID);
        const filesData = { ...files, ...{ ideaID: requestID }};
        await updateIdea(filesData);
    }
    const responseData = { status: 1, ideasArray };
    setTimeout(() => response.json(responseData), 0);
});

// API /api/portfolio/filter - GET ELEMENTS with filter body
router.post(`/filter`, formParser.none(), async (request, response) => {
    const { body: { filterArray, order }} = request;
    const userID = request.data['userID'];
    const requestFunction = (filterArray) ? requestFilteredIdeas : requestIdeas;
    const responseData = await requestFunction({ filterArray, userID, order });
    setTimeout(() => response.json(responseData), 0);
});

// API /api/ideas/all - request all ideas
router.get(`/all`, async (request, response) => {
    const userID = request.data['userID'];
    const responseData = await requestIdeas({ userID });
    setTimeout(() => response.json(responseData), 0);
});

router.get(`/moderated`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    const responseData = await requestModeratedIdeas();
    setTimeout(() => response.json(responseData), 0);
});

router.get(`/to-moderate`, async (request, response, next) => {
    if (!request.data['userID'] || request.data['isAdmin'] !== 1) return next();
    const responseData = await requestNewIdeas();
    setTimeout(() => response.json(responseData), 0);
});

// API /api/ideas/all - request all ideas
router.get(`/category/:categoryID/all`, async (request, response) => {
    const { params: { categoryID }} = request;
    const userID = request.data['userID'];
    const ideasRequest = { categoryID, userID };
    const responseData = await requestCategoryIdeasByID(ideasRequest)
    setTimeout(() => response.json(responseData), 0);
});

// API /api/ideas/:ideaID - GET data for :ideaID idea (single)
router.get(`/:ideaID`, async (request, response) => {
    const { params: { ideaID }} = request;
    const userID = request.data['userID'];
    const { page } = await requestIdea(ideaID, userID);
    setTimeout(() => response.json(page), 0);
});

// API /api/portfolio/filter - GET ELEMENTS with filter body
router.post(`/category/:categoryID/filter`, formParser.none(), async (request, response) => {
    const { params: { categoryID }} = request;
    const { body: { filterArray, order }} = request;
    const userID = request.data['userID'];
    const requestFunction = (filterArray) ? requestCategoryFilteredIdeasByID : requestCategoryIdeasByID;
    const responseData = await requestFunction({ filterArray, userID, order, categoryID });
    setTimeout(() => response.json(responseData), 0);
});

// API /api/ideas/albums - GET albums data
router.get(`/albums/:ideaID`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { params: { ideaID }} = request;
    const userID = request.data['userID'];
    const responseData = await requestSavedAlbums(ideaID, userID);
    setTimeout(() => response.json(responseData), 0);
});

// API /api/ideas - DELETE | delete ideas (single)
router.delete(`/`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { ideaID } = request.body;
    const responseData = await deleteIdea(ideaID);
    await deleteImages(ideaID, uploadDir);
    setTimeout(() => response.json(responseData), 0);
});

// API /api/ideas/relation - DELETE | delete idea relation (single)
router.delete(`/relation`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { body: { ideaID, albumID }, data: { userID }} = request;
    const responseData = await deleteRelations(userID, ideaID, albumID);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;