const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    const isBasementIdeas = true;
    request.data = { ...request.data, isBasementIdeas };
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