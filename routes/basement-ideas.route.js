const { Router } = require(`express`);
const router = new Router();

router.get(`/`, async (request, response) => {
    response.render(`pages/basement-ideas/basement-ideas`, {});
});

router.get(`/:categoryTitle`, async (request, response) => {
    response.render(`pages/basement-ideas/category`, {});
});

router.get(`/:categoryTitle/:subCategoryTitle`, async (request, response) => {
    response.render(`pages/basement-ideas/sub-category`, {});
});

module.exports = router;