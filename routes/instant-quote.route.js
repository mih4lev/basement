const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isInstantQuote = true;
    request.data = Object.assign({ isInstantQuote });
    next();
});

router.get(`/`, async (request, response) => {
    const mockJSON = fs.readFileSync(`data-mock/instant-quote.json`);
    const mockData = JSON.parse(mockJSON);
    const data = Object.assign(request.data, mockData);
    response.render(`pages/instant-quote/instant-quote`, data);
});

router.get(`/:pageTitle`, async (request, response) => {
    const { params: { pageTitle }} = request;
    const mockJSON = fs.readFileSync(`data-mock/instant-quote.json`);
    const { quotes } = JSON.parse(mockJSON);
    const filterFunc = ({ name }) => pageTitle === name;
    const quotesData = quotes.filter(filterFunc);
    if (!quotesData[0]) return response.status(404).redirect(`/404`);
    const data = Object.assign(request.data, quotesData[0]);
    response.render(`pages/instant-quote/instant-quote-single`, data);
});

module.exports = router;