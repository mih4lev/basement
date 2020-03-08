const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    const isBasementIdeas = true;
    request.data = Object.assign({ isBasementIdeas });
    next();
});

router.get(`/`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/basement-ideas/basement-ideas`, data);
});

router.get(`/:categoryTitle`, async (request, response) => {
    const { params: { categoryTitle }} = request;
    const data = Object.assign(request.data);
    response.render(`pages/basement-ideas/basement-ideas`, data);
});

router.get(`/:categoryTitle/:subCategoryTitle`, async (request, response) => {
    const { params: { categoryTitle, subCategoryTitle }} = request;
    const data = Object.assign(request.data);
    response.render(`pages/basement-ideas/basement-ideas`, data);
});

module.exports = router;