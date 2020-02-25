const { Router } = require(`express`);
const router = new Router();

router.get(`/`, async (request, response) => {
    response.render(`pages/guideline/guideline`, {});
});

module.exports = router;