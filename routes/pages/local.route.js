const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isLocalpage = true;
    request.data = { ...request.data, isLocalpage };
    next();
});

router.get(`/`, async (request, response) => {
    const mockJSON = fs.readFileSync(`data-mock/home.json`);
    const homeData = JSON.parse(mockJSON);
    // testimonials
    const mockJSONTestimonials = fs.readFileSync(`data-mock/testimonials.json`);
    const mockDataTestimonials = JSON.parse(mockJSONTestimonials);
    // return data to template rendering
    // variables
    const isAdaptiveHeader = true;
    const data = { ...request.data, ...homeData, ...mockDataTestimonials, isAdaptiveHeader };
    response.render(`pages/local/local`, data);

});

module.exports = router;