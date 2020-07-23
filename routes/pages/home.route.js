const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.get(`/`, async (request, response) => {
    const isHomepage = true;
    const mockJSON1 = fs.readFileSync(`data-mock/basement-tips.json`);
    const { tips } = JSON.parse(mockJSON1);
    tips.length = 5;
    tips[0].isFirstCard = true;
    const mockJSON2 = fs.readFileSync(`data-mock/home.json`);
    const homeData = JSON.parse(mockJSON2);
    // testimonials
    const mockJSONTestimonials = fs.readFileSync(`data-mock/testimonials.json`);
    const mockDataTestimonials = JSON.parse(mockJSONTestimonials);
    // instagram
    const instagramJSON = fs.readFileSync(`data-mock/instagram.json`);
    const instagramData = JSON.parse(instagramJSON);
    // basement-ideas
    const mockJSONIdeas = fs.readFileSync(`data-mock/basement-ideas.json`);
    const mockDataIdeas = JSON.parse(mockJSONIdeas);
    mockDataIdeas.ideas.length = 4;
    // categories
    const mockJSONCategories = fs.readFileSync(`data-mock/ideas-categories.json`);
    const mockDataCategories = JSON.parse(mockJSONCategories);
    // return data to template rendering
    // variables
    const isAdaptiveHeader = true;
    const data = {
        ...request.data, tips, ...mockDataIdeas, instagramData,
        ...homeData, ...mockDataTestimonials, ...mockDataCategories,
        isAdaptiveHeader, isHomepage
    };
    response.render(`pages/home/home`, data);
});

module.exports = router;