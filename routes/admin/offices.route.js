const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestContent } = require("../../models/utils.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { requestModerateCount } = require("../../models/ideas.model");
const {
    addOffice, requestOffices, requestOfficeByID, updateOffice, deleteOffice
} = require("../../models/offices.model");

const responseTimeout = 0;

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminOffices'] = true;
    const pageID = 18;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount(), requestOffices()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/offices/offices.admin.hbs`;
    response.render(template, data);
});

router.get(`/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminOfficesAdd'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/offices/offices-add.admin.hbs`;
    response.render(template, data);
});

router.get(`/edit/:officeID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { officeID }} = request;
    request.data['layout'] = `admin`;
    request.data['isAdminOfficesEdit'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestOfficeByID(officeID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/offices/offices-edit.admin.hbs`;
    response.render(template, data);
});

router.post(`/`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), responseTimeout);
});

router.post(`/add`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await addOffice(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateOffice(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/:officeID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { officeID }} = request;
    const responseData = await deleteOffice(officeID);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;