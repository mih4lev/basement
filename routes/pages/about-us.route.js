const { Router } = require(`express`);
const router = new Router();

const { requestMeta } = require("../../models/pages.model");
const { requestContent } = require("../../models/utils.model");
const {
    requestTestimonials, requestTestimonialByLink, requestTestimonialsCount
} = require("../../models/testimonials.model");
const { requestPress, requestArticleByLink, requestPressCount } = require("../../models/press.model");
const { requestOffices } = require("../../models/offices.model");

router.use((request, response, next) => {
    request.data['isAboutUs'] = true;
    next();
});

router.get(`/`, async (request, response) => {
    return response.redirect(`/about-us/testimonials/`);
});

router.get(`/testimonials`, async (request, response, next) => {
    request.data['isTestimonials'] = true;
    request.data['scripts'] = [`testimonials`];
    const pageID = 6;
    const limit = 9;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTestimonials({ limit }),
        requestTestimonialsCount({ limit })
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/about-us/testimonials/testimonials`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/testimonials/:testimonialLink`, async (request, response, next) => {
    request.data['isTestimonials'] = true;
    const { params: { testimonialLink }} = request;
    const content = requestContent(await Promise.all([
        requestTestimonialByLink(testimonialLink)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/about-us/testimonials/testimonials-single`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/in-the-press`, async (request, response, next) => {
    request.data['isInThePress'] = true;
    request.data['scripts'] = [`press`];
    const pageID = 7;
    const limit = 9;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestPress({ limit }),
        requestPressCount({ limit })
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/about-us/press/press`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/in-the-press/:pressLink`, async (request, response, next) => {
    request.data['isInThePress'] = true;
    const { params: { pressLink }} = request;
    const content = requestContent(await Promise.all([
        requestArticleByLink(pressLink)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/about-us/press/press-single`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/financing-offers`, async (request, response, next) => {
    request.data['scripts'] = [`offers`];
    request.data['isFinancingOffers'] = true;
    const pageID = 8;
    const content = requestContent(await Promise.all([
        requestMeta(pageID)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/about-us/offers/offers`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/contact-us`, async (request, response, next) => {
    request.data['isContactUs'] = true;
    const pageID = 9;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestOffices()
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/about-us/contact-us/contact-us`;
    return (content.page) ? response.render(template, data) : next();
});

module.exports = router;