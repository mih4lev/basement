const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/portfolio/`;
const imagesParser = multer({ dest: uploadDir });

const responseTimeout = 1000;

const { requestContent } = require("../../models/utils.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    createWork, addCreator, requestPortfolio, requestWork, requestCreators, requestImages,
    createImages, updateWork, updateCreator, deleteWork, deleteCreator, deleteImage
} = require("../../models/portfolio.model");
const {
    createPortfolioFilter, requestPortfolioFilters, updatePortfolioFilter, deletePortfolioFilter
} = require("../../models/filters.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { requestModerateCount } = require("../../models/ideas.model");

const portfolioImages = [
    {
        name: `portfolioImages`,
        maxCount: 100,
        sizes: [
            [252, 252, 80],
            [504, 504, 80],
            [154, 154, 80],
            [308, 308, 80],
            [71, 71, 80],
            [142, 142, 80],
            [38, 38, 80],
            [76, 76, 80],
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
    const pageID = 2;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestPortfolio(),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/portfolio/portfolio.admin.hbs`;
    response.render(template, data);
});

router.post(`/`, formParser.none(), async (request, response, next) => {
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

router.post(`/add`, imagesParser.fields(portfolioImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { possibleImage, ...createData } = request.body;
    const responseData = await createWork(createData);
    const { requestID } = responseData;
    const files = await saveImages(portfolioImages, request.files, requestID, false);
    const savedImages = await createImages({ portfolioID: requestID, ...files });
    if (possibleImage) {
        const updateData = { portfolioID: requestID, workImage: savedImages[possibleImage] };
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
    request.data['isAdminPortfolio'] = true;
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

router.post(`/edit`, imagesParser.fields(portfolioImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const {
        portfolioID, isHomeVisible = 0, workImage: selectedImage = 0, possibleImage, ...updateData
    } = request.body;
    const workImage = selectedImage || 0;
    const files = await saveImages(portfolioImages, request.files, portfolioID, false);
    const savedImages = await createImages({ portfolioID, ...files });
    const formData = { ...updateData, portfolioID, isHomeVisible, workImage, ...files };
    const responseData = await updateWork(formData, true);
    if (possibleImage) {
        const updateData = { portfolioID, workImage: savedImages[possibleImage] };
        await updateWork(updateData);
    }
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
    await deleteImages(portfolioID, uploadDir);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.delete(`/filters/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { filterID } = request.body;
    const responseData = await deletePortfolioFilter(filterID);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.delete(`/images/:imageID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { imageID }} = request;
    const responseData = await deleteImage(imageID);
    setTimeout(() => response.json(responseData), responseTimeout);
});


module.exports = router;