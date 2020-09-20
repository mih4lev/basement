const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");

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

module.exports = router;