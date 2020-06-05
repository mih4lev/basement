const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isHomepage = true;
    request.data = { ...request.data, isHomepage };
    next();
});

router.get(`/`, async (request, response) => {
    const mockJSON1 = fs.readFileSync(`data-mock/basement-tips.json`);
    const { tips } = JSON.parse(mockJSON1);
    tips.length = 5;
    tips[0].isFirstCard = true;
    const mockJSON2 = fs.readFileSync(`data-mock/home.json`);
    const homeData = JSON.parse(mockJSON2);
    // testimonials
    const mockJSONTestimonials = fs.readFileSync(`data-mock/testimonials.json`);
    const mockDataTestimonials = JSON.parse(mockJSONTestimonials);
    // basement-ideas
    const mockJSONIdeas = fs.readFileSync(`data-mock/basement-ideas.json`);
    const mockDataIdeas = JSON.parse(mockJSONIdeas);
    mockDataIdeas.ideas.length = 4;
    // categories
    const mockJSONCategories = fs.readFileSync(`data-mock/ideas-categories.json`);
    const mockDataCategories = JSON.parse(mockJSONCategories);
    // return data to template rendering
    const data = {
        ...request.data, tips, ...mockDataIdeas,
        ...homeData, ...mockDataTestimonials, ...mockDataCategories
    };
    response.render(`pages/home/home`, data);
});

module.exports = router;