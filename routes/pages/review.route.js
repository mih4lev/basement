const { Router } = require(`express`);
const router = new Router();

const { requestMeta } = require("../../models/pages.model");
const { requestContent } = require("../../models/utils.model");
const { requestOffices, requestOffice } = require("../../models/offices.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['scripts'] = [];
    request.data['isGreyMain'] = true;
    next();
});

router.get(`/`, async (request, response, next) => {
    const pageID = 12;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestOffices()
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/review/review`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/:pageLink`, async (request, response, next) => {
    const { params: { pageLink }} = request;
    const pageID = 12;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestOffice(pageLink)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/review/review-single`;
    return (content.office) ? response.render(template, data) : next();
});

module.exports = router;