const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");
const { addZipCodes, requestZipCodes, updateZipCodes, deleteZone } = require("../../models/booking.model");

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminZipCodes'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestZipCodes()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/zip-codes/zip-codes.admin.hbs`;
    response.render(template, data);
});

router.post(`/add`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await addZipCodes(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateZipCodes(request.body);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/:codeID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { codeID }} = request;
    const responseData = await deleteZone(codeID);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;