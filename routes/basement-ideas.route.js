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
    const data = Object.assign(request.data);
    response.render(`pages/basement-ideas/category`, data);
});

router.get(`/:categoryTitle/:subCategoryTitle`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/basement-ideas/sub-category`, data);
});

module.exports = router;