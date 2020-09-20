const { Router } = require(`express`);
const router = new Router();

const { requestTestimonials } = require("../../models/testimonials.model");

// API /api/testimonials/all - GET ALL TIPS
router.get(`/all`, async (request, response) => {
    const responseData = await requestTestimonials();
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;