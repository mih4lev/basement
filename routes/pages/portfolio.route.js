const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const {
    requestPortfolio, requestWork
} = require("../../models/portfolio.model");
const {
    requestPortfolioFilters
} = require("../../models/filters.model");
const { requestMeta } = require("../../models/pages.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isPortfolio'] = true;
    request.data['scripts'] = [`portfolio`];
    next();
});

router.get(`/`, async (request, response) => {
    const pageID = 2;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestPortfolio(16),
        requestPortfolioFilters()
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/portfolio/portfolio`;
    response.render(template, data);
});

router.get(`/map`, async (request, response) => {
    const pageID = 2;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestPortfolio(),
        requestPortfolioFilters()
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/portfolio/map/map`;
    response.render(template, data);
});

router.get(`/:portfolioID`, async (request, response, next) => {
    const { params: { portfolioID }} = request;
    const content = requestContent(await Promise.all([
        requestWork(portfolioID)
    ]));
    if (!content.page) return next();
    const data = { ...request.data, ...content };
    const template = `pages/portfolio/work/work`;
    response.render(template, data);
});

module.exports = router;