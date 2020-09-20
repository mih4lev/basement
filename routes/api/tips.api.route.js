const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestTips, requestFilteredTips } = require("../../models/tips.model");

// API /api/tips/all - GET ALL TIPS
router.get(`/all`, async (request, response) => {
    const responseData = await requestTips({ limit: 100000 });
    setTimeout(() => response.json(responseData), 0);
});

// API /api/tips/all - GET ALL TIPS
router.get(`/category`, async (request, response) => {
    const responseData = await requestTips({ limit: 100000 });
    setTimeout(() => response.json(responseData), 0);
});

// API /api/tips/filter - GET TIPS with filter body
router.post(`/filter`, formParser.none(), async (request, response) => {
    const { body: { categories }} = request;
    const requestFunction = (categories) ? requestFilteredTips : requestTips;
    const responseData = await requestFunction({ categories });
    setTimeout(() => response.json(responseData), 0);
});


module.exports = router;