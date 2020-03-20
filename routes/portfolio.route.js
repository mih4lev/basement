const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isPortfolio = true;
    request.data = Object.assign({ isPortfolio });
    next();
});

router.get(`/`, async (request, response) => {
    const mockJSON = fs.readFileSync(`data-mock/portfolio.json`);
    const mockData = JSON.parse(mockJSON);
    const data = Object.assign(request.data, mockData);
    response.render(`pages/portfolio/portfolio`, data);
});

router.get(`/map`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/portfolio/map`, data);
});

router.get(`/:title`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/portfolio/portfolio-single`, data);
});

module.exports = router;