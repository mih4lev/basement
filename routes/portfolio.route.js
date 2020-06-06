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
    response.render(`pages/portfolio/map/map`, data);
});

router.get(`/:requestID`, async (request, response) => {
    const { params: { requestID }} = request;
    const mockJSON = fs.readFileSync(`data-mock/portfolio.json`);
    const { portfolio } = JSON.parse(mockJSON);
    const filterFunc = ({ id }) => Number(requestID) === Number(id);
    const portfolioData = portfolio.filter(filterFunc);
    const data = Object.assign(request.data, portfolioData[0]);
    response.render(`pages/portfolio/work/work`, data);
});

module.exports = router;