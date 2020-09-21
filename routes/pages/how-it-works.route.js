const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestMeta } = require("../../models/pages.model");
const {
    requestCategories, requestTips, requestTipByLink, requestTipsCount
} = require("../../models/tips.model");

router.use((request, response, next) => {
    request.data['isHowItWorks'] = true;
    next();
});

router.get(`/`, async (request, response) => {
    return response.redirect(`/how-it-works/our-process/`);
});

router.get(`/our-process`, async (request, response, next) => {
    request.data['scripts'] = [`process`];
    request.data['isOurProcess'] = true;
    const pageID = 3;
    const content = requestContent(await Promise.all([
        requestMeta(pageID)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/how-it-works/process/process`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/contractor-faq`, async (request, response, next) => {
    request.data['scripts'] = [`process`];
    request.data['isContractorFAQ'] = true;
    const pageID = 4;
    const content = requestContent(await Promise.all([
        requestMeta(pageID)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/how-it-works/contractor/contractor`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/basement-tips`, async (request, response, next) => {
    request.data['isBasementTips'] = true;
    request.data['scripts'] = [`tips`];
    const limit = 9;
    const pageID = 5;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestCategories(),
        requestTips({ limit }),
        requestTipsCount({ limit })
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/how-it-works/blog/blog`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/basement-tips/:tipLink`, async (request, response, next) => {
    request.data['isBasementTips'] = true;
    const { params: { tipLink }} = request;
    const content = requestContent(await Promise.all([
        requestTipByLink(tipLink)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/how-it-works/blog/blog-single`;
    return (content.page) ? response.render(template, data) : next();
});

module.exports = router;