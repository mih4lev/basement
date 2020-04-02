const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    const isInstantQuote = true;
    request.data = Object.assign({ isInstantQuote });
    next();
});

router.get(`/`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/finish-an-unfinished-basement`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/complete-basement-remodeling`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/partial-basement-remodeling`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/flooded-basement-renovation`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/add-bathroom-or-wet-bar`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/add-egress-window-or-walkout`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/foundation-repairs`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/basement-waterproofing`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/instant-quote/instant-quote`, data);
});

module.exports = router;