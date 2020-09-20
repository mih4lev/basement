const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/landings/`;
const imagesParser = multer({ dest: uploadDir });

const { requestContent } = require("../../models/utils.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    createLanding, requestLandings, requestLanding,
    updateLanding, deleteLanding
} = require("../../models/landings.model");
const { requestModerateCount } = require("../../models/ideas.model");

const landingsImages = [
    {
        name: `landingImage`,
        maxCount: 1,
        sizes: [
            [480, 536, 80],
            [769, 637, 80],
            [1000, 537, 80],
            [1440, 594, 80],
            [1440, 960, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// LIST

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminLandings'] = true;
    const content = requestContent(await Promise.all([
        requestLandings(), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/landings.admin.hbs`;
    response.render(template, data);
});

// HOME

router.get(`/home`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminHome'] = true;
    const pageID = 1;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/home.admin.hbs`;
    response.render(template, data);
});

router.post(`/home`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 1000);
});

// ADD

router.get(`/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminLandingAdd'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/add-landing.admin.hbs`;
    response.render(template, data);
});

router.post(`/add`, imagesParser.fields(landingsImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await createLanding(formData);
    const { requestID } = responseData;
    const files = await saveImages(landingsImages, request.files, requestID);
    const filesData = { ...files, ...{ landingID: requestID }};
    await updateLanding(filesData);
    setTimeout(() => response.json(responseData), 1000);
});

// EDIT

router.get(`/edit/:requestID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminLandings'] = true;
    const { params: { requestID }} = request;
    const content = requestContent(await Promise.all([
        requestLanding(requestID, false), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/edit-landing.admin.hbs`;
    response.render(template, data);
});

router.post(`/edit`, imagesParser.fields(landingsImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { landingID } = request.body;
    const files = await saveImages(landingsImages, request.files, landingID);
    const formData = { ...request.body, ...files };
    const responseData = await updateLanding(formData);
    setTimeout(() => response.json(responseData), 1000);
});

// DELETE

router.delete(`/:landingID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { landingID }} = request;
    const responseData = await deleteLanding(landingID);
    await deleteImages(landingID, uploadDir);
    setTimeout(() => response.json(responseData), 1000);
});

module.exports = router;