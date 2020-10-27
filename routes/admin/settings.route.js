const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const uploadDir = `public/upload/users/`;
const imagesParser = multer({ dest: uploadDir });

const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");
const { updateSettings } = require("../../models/settings.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const {
    addZipCodes, requestZipCodes, updateZipCodes, deleteZone
} = require("../../models/booking.model");
const {
    requestUsers, requestUserData, updateUser, deleteUser
} = require("../../models/users.model");

const usersImages = [
    {
        name: `avatarImage`,
        maxCount: 1,
        sizes: [
            [32, 32, 80], [64, 64, 80],
            [76, 76, 80], [152, 152, 80],
            [86, 86, 80], [172, 172, 80],
            [130, 130, 80], [260, 260, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// Email settings

router.get(`/email`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminSettings'] = true;
    request.data['backButton'] = `/admin/`;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/settings/email/email-settings.admin.hbs`;
    response.render(template, data);
});

router.post(`/email/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateSettings(request.body);
    setTimeout(() => response.json(responseData), 0);
});

// Zip codes

router.get(`/zip-codes`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminZipCodes'] = true;
    request.data['isHeaderHidden'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestZipCodes()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/settings/zip-codes/zip-codes.admin.hbs`;
    response.render(template, data);
});

router.post(`/zip-codes/add`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await addZipCodes(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/zip-codes/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateZipCodes(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/zip-codes/:codeID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { codeID }} = request;
    const responseData = await deleteZone(codeID);
    setTimeout(() => response.json(responseData), 0);
});

// Users

router.get(`/users`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminUser'] = true;
    request.data['isHeaderHidden'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestUsers()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/settings/users/users.admin.hbs`;
    response.render(template, data);
});

router.get(`/users/edit/:userID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { userID }} = request;
    request.data['layout'] = `admin`;
    request.data['isAdminUser'] = true;
    request.data['backButton'] = `/admin/settings/users/`;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestUserData(userID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/settings/users/edit-user.admin.hbs`;
    response.render(template, data);
});

router.post(`/users/edit`, imagesParser.fields(usersImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { userID, isAdmin = 0, isSpec = 0, ...userData } = request.body;
    const files = await saveImages(usersImages, request.files, userID);
    const formData = { userID, isAdmin, isSpec, ...userData, ...files };
    const responseData = await updateUser(formData);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/users/:userID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { userID }} = request;
    const responseData = await deleteUser(userID);
    await deleteImages(userID, uploadDir);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;