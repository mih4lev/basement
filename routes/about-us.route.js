const { Router } = require(`express`);
const router = new Router();

router.get(`/`, async (request, response) => {
    response.render(`pages/about-us/about-us`, {});
});

router.get(`/testimonials`, async (request, response) => {
    response.render(`pages/about-us/testimonials/testimonials`, {});
});

router.get(`/testimonials/:testimonialID`, async (request, response) => {
    response.render(`pages/about-us/testimonials/testimonials-single`, {});
});

router.get(`/in-the-press`, async (request, response) => {
    response.render(`pages/about-us/press/press`, {});
});

router.get(`/in-the-press/:pressID`, async (request, response) => {
    response.render(`pages/about-us/press/press-single`, {});
});

router.get(`/financing-offers`, async (request, response) => {
    response.render(`pages/about-us/offers/offers`, {});
});

router.get(`/contact-us`, async (request, response) => {
    response.render(`pages/about-us/contact-us/contact-us`, {});
});

module.exports = router;