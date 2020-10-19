const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/ideas/`;
const imagesParser = multer({ dest: uploadDir });
const categoriesUploadDir = `public/upload/categories/`;
const categoriesParser = multer({ dest: categoriesUploadDir });

const responseTimeout = 0;

const { requestContent } = require("../../models/utils.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    createIdea, addCreator, requestAllIdeas, requestIdea, requestCreators, requestArchiveIdeas,
    requestNewIdeas, requestModeratedIdeas, requestModerateCount, updateIdea, updateCreator,
    updatePositions, updateCategoriesPositions, archiveIdea, deleteIdea, deleteCreator
} = require("../../models/ideas.model");
const {
    createCategory, requestCategories, updateCategory, deleteCategory
} = require("../../models/categories.model");
const {
    createIdeasFilter, requestIdeasFilters, updateIdeasFilter, deleteIdeasFilter
} = require("../../models/filters.model");
const { requestMeta, requestTextContent, updateMeta, updateContent } = require("../../models/pages.model");

const ideasImages = [
    {
        name: `ideaImage`,
        maxCount: 1,
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

const categoriesImages = [
    {
        name: `categoryImage`,
        maxCount: 1,
        sizes: [
            [209, 209, 80],
            [418, 418, 80],
            [137, 137, 80],
            [274, 274, 80],
            [79, 79, 80],
            [158, 158, 80],
            [54, 54, 80],
            [108, 108, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// LIST

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminIdeas'] = true;
    const pageID = 13;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestAllIdeas(),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/ideas.admin.hbs`;
    response.render(template, data);
});

router.post(`/`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { pageID, pageTitle, pageDescription, pageKeywords, ...content } = request.body;
    const metaData = { pageID, pageTitle, pageDescription, pageKeywords };
    const responseData = await updateMeta(metaData);
    await updateContent(content);
    setTimeout(() => response.json(responseData), 0);
});

router.get(`/moderated`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminModeratedIdeas'] = true;
    request.data['ideasAPI'] = `/api/ideas/moderated`;
    const content = requestContent(await Promise.all([
        requestModeratedIdeas({ limit: 40 }),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/ideas-list.admin.hbs`;
    response.render(template, data);
});

router.get(`/to-moderate`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminToModerateIdeas'] = true;
    request.data['ideasAPI'] = `/api/ideas/to-moderate`;
    const content = requestContent(await Promise.all([
        requestNewIdeas({ limit: 40 }),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/ideas-list.admin.hbs`;
    response.render(template, data);
});

router.get(`/archive`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminArchiveIdeas'] = true;
    request.data['ideasAPI'] = `/api/ideas/archive`;
    const content = requestContent(await Promise.all([
        requestArchiveIdeas({ limit: 40 }),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/ideas-list.admin.hbs`;
    response.render(template, data);
});

router.get(`/categories`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminIdeasCategories'] = true;
    const content = requestContent(await Promise.all([
        requestCategories(),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/ideas-categories.admin.hbs`;
    response.render(template, data);
});

router.get(`/filters`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminIdeasFilters'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(),
        requestIdeasFilters()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/ideas-filters.admin.hbs`;
    response.render(template, data);
});

// ADD

router.get(`/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminIdeasAdd'] = true;
    const content = requestContent(await Promise.all([
        requestCreators(),
        requestCategories(),
        requestIdeasFilters(),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/ideas/add-idea.admin.hbs`;
    response.render(template, data);
});

router.post(`/add`, imagesParser.fields(ideasImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await createIdea(formData);
    const { requestID } = responseData;
    const files = await saveImages(ideasImages, request.files, requestID);
    const filesData = { ...files, ...{ ideaID: requestID }};
    await updateIdea(filesData, false);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/creators`, formParser.none(), async (request, response, next) =>  {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await addCreator(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/categories`, categoriesParser.fields(categoriesImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await createCategory(formData);
    const { requestID } = responseData;
    const files = await saveImages(categoriesImages, request.files, requestID);
    const filesData = { ...files, ...{ categoryID: requestID }};
    if (files) await updateCategory(filesData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/categories/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateCategoriesPositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/filters`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await createIdeasFilter(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/filters/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updatePositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

// EDIT

router.get(`/edit/:ideaID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isIdeaEdit'] = true;
    const { params: { ideaID }} = request;
    const content = requestContent(await Promise.all([
        requestIdea(ideaID),
        requestCreators(),
        requestCategories(ideaID),
        requestIdeasFilters(ideaID),
        requestModerateCount()
    ]));
    if (!content.page) return next();
    const data = { ...request.data, ...content };
    const template = `admin/ideas/edit-idea.admin.hbs`;
    response.render(template, data);
});

router.post(`/edit`, imagesParser.fields(ideasImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { ideaID, isModerated = 0, isHomeIdea = 0 } = request.body;
    const files = await saveImages(ideasImages, request.files, ideaID);
    const formData = { ...request.body, isModerated, isHomeIdea, ...files };
    const responseData = await updateIdea(formData, true, true);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/archive/add`, formParser.none(), async (request, response, next) =>  {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await archiveIdea(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/creators/edit`, formParser.none(), async (request, response, next) =>  {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { body: { creatorName }} = request;
    const actionFunc = (creatorName.length) ? updateCreator : deleteCreator;
    const responseData = await actionFunc(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/categories/edit`, categoriesParser.fields(categoriesImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { categoryID } = request.body;
    const files = await saveImages(categoriesImages, request.files, categoryID);
    const formData = { ...request.body, ...files };
    const responseData = await updateCategory(formData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/filters/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateIdeasFilter(request.body);
    setTimeout(() => response.json(responseData), 0);
});

// DELETE

router.delete(`/:ideaID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { ideaID }} = request;
    const responseData = await deleteIdea(ideaID);
    await deleteImages(ideaID, uploadDir);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/categories/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { categoryID } = request.body;
    const responseData = await deleteCategory(categoryID);
    await deleteImages(categoryID, categoriesUploadDir);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/filters/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { filterID } = request.body;
    const responseData = await deleteIdeasFilter(filterID);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;