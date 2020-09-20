const { Router } = require(`express`);
const router = new Router();

const { requestMeta } = require("../../models/pages.model");
const { requestContent } = require("../../models/utils.model");
const { requestQuotes, requestQuote } = require("../../models/quotes.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isInstantQuote'] = true;
    request.data['scripts'] = [];
    next();
});

router.get(`/`, async (request, response, next) => {
    const pageID = 10;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestQuotes()
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/instant-quote/instant-quote`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/:pageURL`, async (request, response, next) => {
    const { params: { pageURL }} = request;
    const content = requestContent(await Promise.all([
        requestQuote(pageURL)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/instant-quote/instant-quote-single`;
    return (content.page) ? response.render(template, data) : next();
});

module.exports = router;