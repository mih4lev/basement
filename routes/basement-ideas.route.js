const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isBasementIdeas = true;
    // basement-ideas
    const mockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideas = JSON.parse(mockJSON);
    // categories
    const mockJSONCategories = fs.readFileSync(`data-mock/ideas-categories.json`);
    const mockDataCategories = JSON.parse(mockJSONCategories);
    // return data to template rendering
    request.data = { ...request.data, isBasementIdeas, ...ideas, ...mockDataCategories };
    next();
});

router.get(`/`, async (request, response) => {
    const data = { ...request.data };
    response.render(`pages/basement-ideas/basement-ideas`, data);
});

router.get(`/:categoryTitle`, async (request, response) => {
    const { params: { categoryTitle }} = request;
    const data = { ...request.data };
    response.render(`pages/basement-ideas/basement-ideas`, data);
});

router.get(`/:categoryTitle/:subCategoryTitle`, async (request, response) => {
    const { params: { categoryTitle, subCategoryTitle }} = request;
    const data = { ...request.data };
    response.render(`pages/basement-ideas/basement-ideas`, data);
});

module.exports = router;