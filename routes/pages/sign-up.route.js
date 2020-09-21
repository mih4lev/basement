const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestMeta } = require("../../models/pages.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isSignUp'] = true;
    request.data['scripts'] = [`sign-up`];
    next();
});

router.get(`/`, async (request, response) => {
    const pageID = 14;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/sign-up/sign-up`;
    response.render(template, data);
});

module.exports = router;