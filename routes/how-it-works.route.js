const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use((request, response, next) => {
    const isHowItWorks = true;
    request.data = Object.assign({ isHowItWorks });
    next();
});

router.get(`/`, async (request, response) => {
    const data = Object.assign(request.data);
    response.render(`pages/how-it-works/how-it-works`, data);
});

router.get(`/our-process`, async (request, response) => {
    const isOurProcess = true;
    const data = Object.assign(request.data, { isOurProcess });
    response.render(`pages/how-it-works/process/process`, data);
});

router.get(`/contractor-faq`, async (request, response) => {
    const isContractorFAQ = true;
    const data = Object.assign(request.data, { isContractorFAQ });
    response.render(`pages/how-it-works/contractor/contractor`, data);
});

router.get(`/basement-tips`, async (request, response) => {
    const isBasementTips = true;
    const mockJSON = fs.readFileSync(`data-mock/basement-tips.json`);
    const mockData = JSON.parse(mockJSON);
    const data = Object.assign(request.data, mockData,{ isBasementTips });
    response.render(`pages/how-it-works/blog/blog`, data);
});

router.get(`/basement-tips/:tagName`, async (request, response) => {
    const isBasementTips = true;
    const data = Object.assign(request.data, { isBasementTips });
    response.render(`pages/how-it-works/blog/blog-tag-list`, data);
});

router.get(`/basement-tips/:tagName/:tipID`, async (request, response) => {
    const { params: { tagName, tipID }} = request;
    const isBasementTips = true;
    const mockJSON = fs.readFileSync(`data-mock/basement-tips.json`);
    const { tips } = JSON.parse(mockJSON);
    const filterFunc = ({ id }) => Number(tipID) === Number(id);
    const basementTipsData = tips.filter(filterFunc);
    const data = Object.assign(request.data, basementTipsData[0], { isBasementTips });
    response.render(`pages/how-it-works/blog/blog-single`, data);
});

module.exports = router;