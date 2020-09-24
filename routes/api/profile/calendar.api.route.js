const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const tokensFolder = `tokens/`;

const { requestAuthURL, createAccessToken } = require("../../../models/calendar.model");

// API /api/profile/calendar/auth GET
router.get(`/edit`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isSpec']) return next();
    const responseData = await requestAuthURL();
    setTimeout(() => response.json(responseData), 0);
});

// API /api/profile/calendar/code POST
router.post(`/`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isSpec']) return next();
    const { body: { authCode }, data: { userID }} = request;
    const tokenPath = tokensFolder + userID + `.json`;
    const responseData = await createAccessToken(authCode, tokenPath);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;