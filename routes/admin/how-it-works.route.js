const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/tips/`;
const imagesParser = multer({ dest: uploadDir });

const { requestContent } = require("../../models/utils.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    createTip, createCategory, requestTips, requestTip, requestCategories,
    updateTip, updateCategory, deleteTip, deleteCategory
} = require("../../models/tips.model");

const { requestModerateCount } = require("../../models/ideas.model");

const tipImages = [
    {
        name: `tipImage`,
        maxCount: 1,
        sizes: [
            [120, 83, 80], [240, 166, 80],
            [228, 123, 80], [456, 246, 80],
            [236, 123, 80], [472, 246, 80],
            [314, 173, 80], [628, 346, 80],
            [330, 173, 80], [660, 346, 80],
            [482, 251, 80], [964, 502, 80],
            [722, 271, 80], [1444, 542, 80],
            [770, 293, 80], [1540, 586, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// OUR PROCESS

router.get(`/our-process`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminProcess'] = true;
    const pageID = 3;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/how-it-works/our-process.admin.hbs`;
    response.render(template, data);
});

router.post(`/our-process`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// FAQ

router.get(`/faq`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFAQ'] = true;
    const pageID = 4;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/how-it-works/faq.admin.hbs`;
    response.render(template, data);
});

router.post(`/faq`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// TIPS LIST

router.get(`/basement-tips`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminTips'] = true;
    const pageID = 5;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestTips(), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/how-it-works/basement-tips.admin.hbs`;
    response.render(template, data);
});

router.post(`/basement-tips`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// TIPS ADD

router.get(`/basement-tips/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminTipsAdd'] = true;
    const content = requestContent(await Promise.all([
        requestCategories(), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/how-it-works/add-tip.admin.hbs`;
    response.render(template, data);
});

router.post(`/basement-tips/add`, imagesParser.fields(tipImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await createTip(formData);
    const { requestID } = responseData;
    const files = await saveImages(tipImages, request.files, requestID);
    const filesData = { ...files, ...{ tipID: requestID }};
    await updateTip(filesData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/basement-tips/categories`, formParser.none(), async (request, response, next) =>  {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await createCategory(request.body);
    setTimeout(() => response.json(responseData), 0);
});

// TIPS EDIT

router.get(`/basement-tips/edit/:tipID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminTips'] = true;
    const { params: { tipID }} = request;
    const content = requestContent(await Promise.all([
        requestTip(tipID), requestCategories(), requestModerateCount()
    ]));
    if (!content.page) return next();
    // replace quotes for tinyMCE
    content.page.tipText =  content.page.tipText.replace(/"/g, "&quot;");
    const data = { ...request.data, ...content };
    const template = `admin/how-it-works/edit-tip.admin.hbs`;
    response.render(template, data);
});

router.post(`/basement-tips/edit`, imagesParser.fields(tipImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { tipID } = request.body;
    const files = await saveImages(tipImages, request.files, tipID);
    const formData = { ...request.body, ...files };
    const responseData = await updateTip(formData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/basement-tips/categories/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { body: { categoryName }} = request;
    const actionFunc = (categoryName.length) ? updateCategory : deleteCategory;
    const responseData = await actionFunc(request.body);
    setTimeout(() => response.json(responseData), 0);
});

// TIPS DELETE

router.delete(`/basement-tips/:tipID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { tipID }} = request;
    const responseData = await deleteTip(tipID);
    await deleteImages(tipID, uploadDir);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;