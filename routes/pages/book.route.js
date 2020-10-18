const { Router } = require(`express`);
const router = new Router();

const { requestMeta } = require("../../models/pages.model");
const { requestContent } = require("../../models/utils.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['scripts'] = [];
    next();
});

router.get(`/`, async (request, response, next) => {
    const pageID = 17;
    const content = requestContent(await Promise.all([
        requestMeta(pageID)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/book/book`;
    return (content.page) ? response.render(template, data) : next();
});

module.exports = router;