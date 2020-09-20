const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isSignUp'] = true;
    request.data['scripts'] = [`sign-up`];
    next();
});

router.get(`/`, async (request, response) => {
    const data = { ...request.data };
    const template = `pages/sign-up/sign-up`;
    response.render(template, data);
});

module.exports = router;