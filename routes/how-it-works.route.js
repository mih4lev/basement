const { Router } = require(`express`);
const router = new Router();

router.get(`/`, async (request, response) => {
    response.render(`pages/how-it-works/how-it-works`, {});
});

router.get(`/our-process`, async (request, response) => {
    response.render(`pages/how-it-works/process/process`, {});
});

router.get(`/contractor-faq`, async (request, response) => {
    response.render(`pages/how-it-works/contractor/contractor`, {});
});

router.get(`/basement-tips`, async (request, response) => {
    response.render(`pages/how-it-works/blog/blog`, {});
});

router.get(`/basement-tips/:tagName`, async (request, response) => {
    response.render(`pages/how-it-works/blog/blog-tag-list`, {});
});

router.get(`/basement-tips/:tagName/:tipTitle`, async (request, response) => {
    response.render(`pages/how-it-works/blog/blog-single`, {});
});

module.exports = router;