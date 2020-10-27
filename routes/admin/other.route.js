const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestContent } = require("../../models/utils.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { requestModerateCount } = require("../../models/ideas.model");

// INSTANT QUOTES

router.get(`/instant-quotes`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminQuotes'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/instant-quote/`;
    const pageID = 10;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/other/instant-quotes.admin.hbs`;
    response.render(template, data);
});

router.post(`/instant-quotes`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// THANK YOU

router.get(`/thank-you`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminThanks'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/thank-you/`;
    const pageID = 11;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/other/thank-you.admin.hbs`;
    response.render(template, data);
});

router.post(`/thank-you`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// LEAVE REVIEW

router.get(`/leave-review`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminReview'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/leave-a-review/`;
    const pageID = 12;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/other/leave-review.admin.hbs`;
    response.render(template, data);
});

router.post(`/leave-review`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;