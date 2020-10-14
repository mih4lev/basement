const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/ideas/`;
const imagesParser = multer({ dest: uploadDir });

const responseTimeout = 0;

const { requestContent } = require("../../models/utils.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    createWork, addCreator, requestPortfolio, requestWork, requestCreators, requestImages,
    updatePositions, updateImagePositions, updateFiltersPositions,
    updateWork, updateCreator, deleteWork, deleteCreator
} = require("../../models/portfolio.model");
const {
    createPortfolioFilter, requestPortfolioFilters, updatePortfolioFilter, deletePortfolioFilter
} = require("../../models/filters.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const {
    createIdea, updateIdea, deleteIdea, requestModerateCount, requestIdeasByPortfolioID
} = require("../../models/ideas.model");

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

// LIST

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminPortfolio'] = true;
    const content = requestContent(await Promise.all([
        requestPortfolio(30),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/portfolio/portfolio.admin.hbs`;
    response.render(template, data);
});

router.get(`/settings`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminPortfolioSettings'] = true;
    const pageID = 2;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/portfolio/portfolio-settings.admin.hbs`;
    response.render(template, data);
});

router.post(`/settings`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.get(`/filters`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminPortfolioFilters'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(),
        requestPortfolioFilters()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/portfolio/portfolio-filters.admin.hbs`;
    response.render(template, data);
});

router.post(`/filters/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateFiltersPositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

// ADD

router.get(`/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminPortfolioAdd'] = true;
    const content = requestContent(await Promise.all([
        requestCreators(),
        requestModerateCount(),
        requestPortfolioFilters()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/portfolio/add-portfolio.admin.hbs`;
    response.render(template, data);
});

const saveIdeasImages = async ({ files, userID, creatorID = 9, ideaTitle, portfolioID }) => {
    const savedImages = [];
    if (files['ideaImage']) {
        for (const file of files['ideaImage']) {
            const sendFile = {};
            sendFile['ideaImage'] = [];
            sendFile['ideaImage'].push(file);
            const ideaData = { userID, creatorID, ideaTitle, portfolioID };
            const { requestID } = await createIdea(ideaData);
            const files = await saveImages(ideasImages, sendFile, requestID);
            const filesData = { ...files, ...{ ideaID: requestID }};
            await updateIdea(filesData, false);
            savedImages.push(requestID);
        }
    }
    return savedImages;
};

router.post(`/add`, imagesParser.fields(ideasImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { possibleImage, workTitle, ...createData } = request.body;
    const responseData = await createWork({ workTitle, ...createData });
    const { requestID: portfolioID } = responseData;
    const ideasData = {
        files: request.files, userID: request.data['userID'],
        ideaTitle: workTitle, portfolioID
    };
    const savedImages = await saveIdeasImages(ideasData);
    if (possibleImage) {
        const updateData = { portfolioID, workImage: savedImages[possibleImage] };
        await updateWork(updateData);
    }
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/creators`, formParser.none(), async (request, response, next) =>  {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await addCreator(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/filters`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await createPortfolioFilter(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

// EDIT

router.get(`/edit/:portfolioID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isPortfolioEdit'] = true;
    const { params: { portfolioID }} = request;
    const content = requestContent(await Promise.all([
        requestWork(portfolioID),
        requestImages(portfolioID),
        requestCreators(),
        requestModerateCount(),
        requestPortfolioFilters(portfolioID)
    ]));
    if (!content.page) return next();
    // replace quotes for tinyMCE
    if (content.page.workText) {
        content.page.workText = content.page.workText.replace(/"/g, "&quot;");
    }
    const data = { ...request.data, ...content };
    const template = `admin/portfolio/edit-portfolio.admin.hbs`;
    response.render(template, data);
});

router.post(`/edit`, imagesParser.fields(ideasImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const {
        portfolioID, workTitle, isHomeVisible = 0, workImage: selectedImage = 0,
        possibleImage, ...updateData
    } = request.body;
    const workImage = selectedImage || 0;
    const ideasData = {
        files: request.files, userID: request.data['userID'],
        ideaTitle: workTitle, portfolioID
    };
    const savedImages = await saveIdeasImages(ideasData);
    const formData = { ...updateData, portfolioID, isHomeVisible, workImage, workTitle };
    const responseData = await updateWork(formData, true);
    if (possibleImage) {
        const updateData = { portfolioID, workImage: savedImages[possibleImage] };
        await updateWork(updateData);
    }
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updatePositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/images/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateImagePositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/creators/edit`, formParser.none(), async (request, response, next) =>  {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { body: { creatorName }} = request;
    const actionFunc = (creatorName.length) ? updateCreator : deleteCreator;
    const responseData = await actionFunc(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/filters/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updatePortfolioFilter(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

// DELETE

router.delete(`/:portfolioID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { portfolioID }} = request;
    const responseData = await deleteWork(portfolioID);
    const { ideas } = await requestIdeasByPortfolioID(portfolioID);
    if (ideas) {
        for (const { ideaID } of ideas) {
            await deleteIdea(ideaID);
            await deleteImages(ideaID, uploadDir);
        }
    }
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.delete(`/filters/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { filterID } = request.body;
    const responseData = await deletePortfolioFilter(filterID);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.delete(`/images/:ideaID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { ideaID }} = request;
    const responseData = await deleteIdea(ideaID);
    await deleteImages(ideaID, uploadDir);
    setTimeout(() => response.json(responseData), responseTimeout);
});


module.exports = router;