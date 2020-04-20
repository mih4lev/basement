const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    const isSignUp = true;
    request.data = { ...request.data, isSignUp };
    next();
});

router.get(`/`, async (request, response) => {
    const data = { ...request.data };
    response.render(`pages/sign-up/sign-up`, data);
});

module.exports = router;