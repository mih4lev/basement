const { Router } = require(`express`);
const router = new Router();

const { requestMeta } = require("../../models/pages.model");
const { requestContent } = require("../../models/utils.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['scripts'] = [`thank-you`];
    request.data['isGreyMain'] = true;
    next();
});

router.get(`/`, async (request, response, next) => {
    const { query: { referer }} = request;
    const isBookingReferer = (referer === `booking`);
    const pageID = 16;
    const content = requestContent(await Promise.all([
        requestMeta(pageID)
    ]));
    const data = { ...request.data, ...content, isBookingReferer };
    const template = `pages/thank-you/thank-you`;
    return (content.page) ? response.render(template, data) : next();
});

module.exports = router;