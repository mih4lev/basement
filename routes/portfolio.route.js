const { Router } = require(`express`);
const router = new Router();

router.get(`/`, async (request, response) => {
    response.render(`pages/portfolio/portfolio`, {});
});

router.get(`/map`, async (request, response) => {
    response.render(`pages/portfolio/map`, {});
});

router.get(`/:title`, async (request, response) => {
    response.render(`pages/portfolio/portfolio-single`, {});
});

module.exports = router;