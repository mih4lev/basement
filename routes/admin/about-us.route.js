const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const testimonialsDir = `public/upload/testimonials/`;
const pressDir = `public/upload/press/`;
const testimonialsImagesParser = multer({ dest: testimonialsDir });
const pressImagesParser = multer({ dest: pressDir });

const responseTimeout = 0;

const { requestContent } = require("../../models/utils.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { saveImages, deleteImages } = require("../../models/images.model");
const {
    createPress, requestPress, requestArticle, updatePress,
    updatePositions: updatePressPositions, deletePress
} = require("../../models/press.model");
const {
    createTestimonial, requestTestimonials, requestTestimonial,
    updateTestimonial, updatePositions: updateTestimonialsPositions, deleteTestimonial
} = require("../../models/testimonials.model");

const { requestModerateCount } = require("../../models/ideas.model");

const testimonialImages = [
    {
        name: `testimonialImage`,
        maxCount: 1,
        sizes: [
            [120, 83, 80], [240, 166, 80],
            [228, 123, 80], [456, 246, 80],
            [236, 123, 80], [472, 246, 80],
            [314, 173, 80], [628, 346, 80],
            [330, 173, 80], [660, 346, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

const pressImages = [
    {
        name: `pressImage`,
        maxCount: 1,
        sizes: [
            [120, 83, 80], [240, 166, 80],
            [228, 123, 80], [456, 246, 80],
            [236, 123, 80], [472, 246, 80],
            [314, 173, 80], [628, 346, 80],
            [330, 173, 80], [660, 346, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// TESTIMONIALS REQUEST

router.get(`/testimonials`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminTestimonials'] = true;
    const pageID = 6;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTestimonials(),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/testimonials.admin.hbs`;
    response.render(template, data);
});

router.post(`/testimonials`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// TESTIMONIALS CREATE

router.get(`/testimonials/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminTestimonialsAdd'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/add-testimonial.admin.hbs`;
    response.render(template, data);
});

router.post(`/testimonials/add`, testimonialsImagesParser.fields(testimonialImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await createTestimonial(formData);
    const { requestID } = responseData;
    const files = await saveImages(testimonialImages, request.files, requestID);
    const filesData = { ...files, ...{ testimonialID: requestID }};
    await updateTestimonial(filesData);
    setTimeout(() => response.json(responseData), 0);
});

// TESTIMONIALS EDIT

router.get(`/testimonials/edit/:testimonialID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isTestimonialEdit'] = true;
    const { params: { testimonialID }} = request;
    const content = requestContent(await Promise.all([
        requestTestimonial(testimonialID),
        requestModerateCount()
    ]));
    if (!content.page) return next();
    // replace quotes for tinyMCE
    if (content.page.testimonialText) {
        content.page.testimonialText = content.page.testimonialText.replace(/"/g, "&quot;");
    }
    const data = { ...request.data, ...content };
    const template = `admin/about-us/edit-testimonial.admin.hbs`;
    response.render(template, data);
});

router.post(`/testimonials/edit`, testimonialsImagesParser.fields(testimonialImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { testimonialID } = request.body;
    const files = await saveImages(testimonialImages, request.files, testimonialID);
    const formData = { ...request.body, ...files };
    const responseData = await updateTestimonial(formData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/testimonials/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updateTestimonialsPositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

// TESTIMONIALS DELETE

router.delete(`/testimonials/:testimonialID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { testimonialID }} = request;
    const responseData = await deleteTestimonial(testimonialID);
    await deleteImages(testimonialID, testimonialsDir);
    setTimeout(() => response.json(responseData), 0);
});

// PRESS REQUEST

router.get(`/press`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminPress'] = true;
    const pageID = 7;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestPress(), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/press.admin.hbs`;
    response.render(template, data);
});

router.post(`/press`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// PRESS CREATE

router.get(`/press/add`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminPressAdd'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/add-press.admin.hbs`;
    response.render(template, data);
});

router.post(`/press/add`, pressImagesParser.fields(pressImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await createPress(formData);
    const { requestID } = responseData;
    const files = await saveImages(pressImages, request.files, requestID);
    const filesData = { ...files, ...{ pressID: requestID }};
    await updatePress(filesData);
    setTimeout(() => response.json(responseData), 0);
});

// PRESS EDIT

router.get(`/press/edit/:pressID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isPressEdit'] = true;
    const { params: { pressID }} = request;
    const content = requestContent(await Promise.all([
        requestArticle(pressID), requestModerateCount()
    ]));
    if (!content.page) return next();
    // replace quotes for tinyMCE
    if (content.page.pressText) {
        content.page.pressText = content.page.pressText.replace(/"/g, "&quot;");
    }
    const data = { ...request.data, ...content };
    const template = `admin/about-us/edit-press.admin.hbs`;
    response.render(template, data);
});

router.post(`/press/edit`, pressImagesParser.fields(pressImages), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { pressID } = request.body;
    const files = await saveImages(pressImages, request.files, pressID);
    const formData = { ...request.body, ...files };
    const responseData = await updatePress(formData);
    setTimeout(() => response.json(responseData), 0);
});

router.post(`/press/sort`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const responseData = await updatePressPositions(request.body);
    setTimeout(() => response.json(responseData), responseTimeout);
});

// PRESS DELETE

router.delete(`/press/:pressID`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { pressID }} = request;
    const responseData = await deletePress(pressID);
    await deleteImages(pressID, pressDir);
    setTimeout(() => response.json(responseData), 0);
});

// FINANCING OFFERS

router.get(`/offers`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminOffers'] = true;
    const pageID = 8;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/offers.admin.hbs`;
    response.render(template, data);
});

router.post(`/offers`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// CONTACT US

router.get(`/contact-us`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminContact'] = true;
    const pageID = 9;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/contact-us.admin.hbs`;
    response.render(template, data);
});

router.post(`/contact-us`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// INSTANT QUOTES

router.get(`/instant-quotes`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminQuotes'] = true;
    const pageID = 10;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/instant-quotes.admin.hbs`;
    response.render(template, data);
});

router.post(`/instant-quotes`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// THANK YOU

router.get(`/thank-you`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminThanks'] = true;
    const pageID = 11;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/thank-you.admin.hbs`;
    response.render(template, data);
});

router.post(`/thank-you`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

// LEAVE REVIEW

router.get(`/leave-review`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminReview'] = true;
    const pageID = 12;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/leave-review.admin.hbs`;
    response.render(template, data);
});

router.post(`/leave-review`, formParser.none(), async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;