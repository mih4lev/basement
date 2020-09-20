const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestFilteredPortfolio, requestPortfolio } = require("../../models/portfolio.model");

// API /api/portfolio/all - GET ALL ELEMENTS
router.get(`/all`, async (request, response) => {
    const responseData = await requestPortfolio(100000);
    setTimeout(() => response.json(responseData), 0);
});

// API /api/portfolio/filter - GET ELEMENTS with filter body
router.post(`/filter`, formParser.none(), async (request, response) => {
    const requestData = { limit: 100000, filters: request.body };
    const responseData = await requestFilteredPortfolio(requestData);
    setTimeout(() => response.json(responseData), 100);
});

module.exports = router;