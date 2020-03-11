const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isAboutUs = true;
    request.data = Object.assign({ isAboutUs });
    next();
});

router.get(`/`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/about-us/about-us`, data);
});

router.get(`/testimonials`, async (request, response) => {
    const isTestimonials = true;
    const mockJSON = fs.readFileSync(`data-mock/testimonials.json`);
    const mockData = JSON.parse(mockJSON);
    const data = Object.assign(request.data, mockData,{ isTestimonials });
    response.render(`pages/about-us/testimonials/testimonials`, data);
});

router.get(`/testimonials/:testimonialID`, async (request, response) => {
    const isTestimonials = true;
    const data = Object.assign(request.data, { isTestimonials });
    response.render(`pages/about-us/testimonials/testimonials-single`, data);
});

router.get(`/in-the-press`, async (request, response) => {
    const isTnThePress = true;
    const data = Object.assign(request.data, { isTnThePress });
    response.render(`pages/about-us/press/press`, data);
});

router.get(`/in-the-press/:pressID`, async (request, response) => {
    const isTnThePress = true;
    const data = Object.assign(request.data, { isTnThePress });
    response.render(`pages/about-us/press/press-single`, data);
});

router.get(`/financing-offers`, async (request, response) => {
    const isFinancingOffers = true;
    const data = Object.assign(request.data, { isFinancingOffers });
    response.render(`pages/about-us/offers/offers`, data);
});

router.get(`/contact-us`, async (request, response) => {
    const isContactUs = true;
    const data = Object.assign(request.data, { isContactUs });
    response.render(`pages/about-us/contact-us/contact-us`, data);
});

module.exports = router;