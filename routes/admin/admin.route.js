const { Router } = require(`express`);
const router = new Router();

const { requestModerateCount } = require("../../models/ideas.model");
const { requestContent } = require("../../models/utils.model");

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/admin`;
    response.render(template, data);
});

module.exports = router;