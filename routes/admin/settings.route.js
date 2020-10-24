const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");
const { updateSettings } = require("../../models/settings.model");

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminSettings'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/settings/settings.admin.hbs`;
    response.render(template, data);
});

router.post(`/edit`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateSettings(request.body);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;