const { Router } = require(`express`);
const router = new Router();

const { requestPress } = require("../../models/press.model");

// API /api/press/all - GET ALL TIPS
router.get(`/all`, async (request, response) => {
    const responseData = await requestPress();
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;