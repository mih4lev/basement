const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const uploadDir = `public/upload/users/`;
const imagesParser = multer({ dest: uploadDir });

const { saveImages, deleteImages } = require("../../models/images.model");
const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");
const { requestUsers, requestUserData, updateUser, deleteUser } = require("../../models/users.model");

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

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminUser'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestUsers()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/users/users.admin.hbs`;
    response.render(template, data);
});

router.get(`/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminUserAdd'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/users/add-user.admin.hbs`;
    response.render(template, data);
});

router.get(`/edit/:userID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { userID }} = request;
    request.data['layout'] = `admin`;
    request.data['isAdminUser'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestUserData(userID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/users/edit-user.admin.hbs`;
    response.render(template, data);
});

router.post(`/edit`, imagesParser.fields(usersImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { userID, isAdmin = 0, ...userData } = request.body;
    const files = await saveImages(usersImages, request.files, userID);
    const formData = { userID, isAdmin, ...userData, ...files };
    const responseData = await updateUser(formData);
    setTimeout(() => response.json(responseData), 1000);
});

router.delete(`/:userID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { userID }} = request;
    const responseData = await deleteUser(userID);
    await deleteImages(userID, uploadDir);
    setTimeout(() => response.json(responseData), 1000);
});

module.exports = router;