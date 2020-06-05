const { Router } = require(`express`);
const router = new Router();

router.get(`/`, async (request, response) => {
    response.render(`pages/profile/profile`, {});
});

module.exports = router;