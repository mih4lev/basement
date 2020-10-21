const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");
const { requestZipCodes } = require("../../models/booking.model");

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminZipCodes'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestZipCodes()
    ]));
    const data = { ...request.data, ...content };
    console.log(data);
    const template = `admin/zip-codes/zip-codes.admin.hbs`;
    response.render(template, data);
});

module.exports = router;