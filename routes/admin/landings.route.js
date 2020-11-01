const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/landings/`;
const imagesParser = multer({ dest: uploadDir });
const sliderDir = `public/upload/slider/`;
const sliderParser = multer({ dest: sliderDir });

const { requestContent } = require("../../models/utils.model");
const { requestMeta, requestTextContent, updateMeta, updateContent } = require("../../models/pages.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    createLanding, createSlide, requestLandings, requestLanding, requestSlider,
    updateLanding, updateSlide, updatePositions, deleteLanding, deleteSlide
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

const sliderImages = [
    {
        name: `sliderImage`,
        maxCount: 1,
        sizes: [
            [480, 722, 80], [960, 1444, 80],
            [768, 726, 80], [1536, 726, 80],
            [1000, 619, 80], [2000, 1238, 80],
            [1440, 721, 80], [2880, 1442, 80],
            [1440, 877, 80], [2880, 1754, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// LIST

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminLandings'] = true;
    request.data['isHeaderHidden'] = true;
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
    request.data['backButton'] = `/admin/landings/`;
    request.data['locationLink'] = `/`;
    const pageID = 1;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestTextContent(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/home.admin.hbs`;
    response.render(template, data);
});

router.post(`/home`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { pageID, pageTitle, pageDescription, pageKeywords, ...content } = request.body;
    const metaData = { pageID, pageTitle, pageDescription, pageKeywords };
    const responseData = await updateMeta(metaData);
    await updateContent(content);
    setTimeout(() => response.json(responseData), 0);
});

// ADD

router.get(`/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminLandingAdd'] = true;
    request.data['backButton'] = `/admin/landings/`;
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
    setTimeout(() => response.json(responseData), 0);
});

// EDIT

router.get(`/edit/:requestID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminLandingsEdit'] = true;
    request.data['backButton'] = `/admin/landings/`;
    const { params: { requestID }} = request;
    const content = requestContent(await Promise.all([
        requestLanding(requestID, false), requestModerateCount()
    ]));
    request.data['locationLink'] = `/` + content['page']['pageURL'];
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
    setTimeout(() => response.json(responseData), 0);
});

router.get(`/header-images`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminHeaderImages'] = true;
    request.data['isHeaderHidden'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestSlider()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/header-images.admin.hbs`;
    response.render(template, data);
});

router.post(`/header-images/add`, sliderParser.fields(sliderImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const slideData = { ...request.body };
    const { requestID: sliderID } = await createSlide(slideData);
    const files = await saveImages(sliderImages, request.files, sliderID);
    const updateData = { ...files, sliderID };
    const responseData = await updateSlide(updateData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/header-images/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updatePositions(request.body);
    setTimeout(() => response.json(responseData), 0);
});

// DELETE

router.delete(`/:landingID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { landingID }} = request;
    const responseData = await deleteLanding(landingID);
    await deleteImages(landingID, uploadDir);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/header-images/:sliderID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { sliderID }} = request;
    const responseData = await deleteSlide(sliderID);
    await deleteImages(sliderID, sliderDir);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;