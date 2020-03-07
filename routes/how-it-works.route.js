const { Router } = require(`express`);
const router = new Router();



router.get(`/`, async (request, response) => {
    const isHowItWorks = true;
    const data = Object.assign({ isHowItWorks });
    response.render(`pages/how-it-works/how-it-works`, data);
});

router.get(`/our-process`, async (request, response) => {
    const isHowItWorks = true;
    const isOurProcess = true;
    const data = Object.assign({ isOurProcess, isHowItWorks });
    response.render(`pages/how-it-works/process/process`, data);
});

router.get(`/contractor-faq`, async (request, response) => {
    const isHowItWorks = true;
    const isContractorFAQ = true;
    const data = Object.assign({ isContractorFAQ, isHowItWorks });
    response.render(`pages/how-it-works/contractor/contractor`, data);
});

router.get(`/basement-tips`, async (request, response) => {
    const isHowItWorks = true;
    const isBasementTips = true;
    const data = Object.assign({ isBasementTips, isHowItWorks });
    response.render(`pages/how-it-works/blog/blog`, data);
});

router.get(`/basement-tips/:tagName`, async (request, response) => {
    const isHowItWorks = true;
    const isBasementTips = true;
    const data = Object.assign({ isBasementTips, isHowItWorks });
    response.render(`pages/how-it-works/blog/blog-tag-list`, data);
});

router.get(`/basement-tips/:tagName/:tipTitle`, async (request, response) => {
    const isHowItWorks = true;
    const isBasementTips = true;
    const data = Object.assign({ isBasementTips, isHowItWorks });
    response.render(`pages/how-it-works/blog/blog-single`, data);
});

module.exports = router;