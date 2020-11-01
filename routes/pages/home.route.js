const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestMeta, requestTextContent } = require("../../models/pages.model");
const { requestHomePortfolio } = require("../../models/portfolio.model");
const { requestTestimonials } = require("../../models/testimonials.model");
const { requestAwards } = require("../../models/awards.model");
const { requestInstagram } = require("../../models/instagram.model");
const { requestSubCategories } = require("../../models/categories.model");
const { requestHomeIdeas } = require("../../models/ideas.model");
const { requestSteps } = require("../../models/steps.model");
const { requestPrice } = require("../../models/price.model");
const { requestOffices } = require("../../models/offices.model");
const { requestLocation } = require("../../models/location.model");
const { requestFAQ } = require("../../models/faq.model");
const { requestLicenses } = require("../../models/licenses.model");
const { requestTips } = require("../../models/tips.model");
const { requestLanding, requestSlider } = require("../../models/landings.model");

router.get(`/`, async (request, response, next) => {
    request.data['isHomepage'] = true;
    request.data['isAdaptiveHeader'] = true;
    request.data['scripts'] = [`home`];
    const pageID = 1;
    const ideasURL = `spaces`;
    const userID = request.data['userID'];
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestSlider(),
        requestHomePortfolio(10),
        requestTestimonials({ limit: 6 }),
        requestAwards(),
        requestInstagram(),
        requestSubCategories(ideasURL, true),
        requestHomeIdeas({ userID }),
        requestSteps(),
        requestPrice(),
        requestOffices(),
        requestLocation(),
        requestFAQ(),
        requestLicenses(),
        requestTips({ limit: 5 })
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/home/home`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/:landingURL`, async (request, response, next) => {
    request.data[`isAdaptiveHeader`] = true;
    request.data['scripts'] = [`landing`];
    const { params: { landingURL }} = request;
    const content = requestContent(await Promise.all([
        requestLanding(landingURL),
        requestSlider(),
        requestHomePortfolio(10),
        requestTestimonials({ limit: 6 }),
        requestInstagram()
    ]));
    if (!content.page) return next();
    // replace quotes for tinyMCE
    content.page.headerText =  content.page.headerText.replace(/"/g, "&quot;");
    content.page.footerText =  content.page.footerText.replace(/"/g, "&quot;");
    const data = { ...request.data, ...content };
    const template = `pages/landing/landing`;
    return (content.page) ? response.render(template, data) : next();
});

module.exports = router;