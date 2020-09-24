const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const tokensFolder = `tokens/`;

const {
    requestCalendar, requestAuthURL, createAccessToken
} = require("../../../models/calendar.model");

// API /api/profile/calendar/auth GET
router.get(`/auth`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isSpec']) return next();
    const responseData = await requestAuthURL();
    setTimeout(() => response.json(responseData), 0);
});

// API /api/profile/calendar/valid GET
router.get(`/valid`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isSpec']) return next();
    const userID = request.data['userID'];
    const responseData = await requestCalendar(userID);
    setTimeout(() => response.json(responseData), 0);
});

// API /api/profile/calendar/code POST
router.post(`/code`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isSpec']) return next();
    const { body: { authCode }, data: { userID }} = request;
    const tokenPath = tokensFolder + userID + `.json`;
    const responseData = await createAccessToken(authCode, tokenPath);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;