const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestModerateCount } = require("../../models/ideas.model");
const {
    requestBookingList, requestContactsList, requestQuotesList,
    requestBookingContent, requestContactsContent, requestQuotesContent,
    deleteBookingData, deleteContactsData, deleteQuotesData
} = require("../../models/forms.model");

// LIST

router.get(`/booking`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFormsBooking'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestBookingList()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/forms/booking/booking-list.admin.hbs`;
    response.render(template, data);
});

router.get(`/booking/:bookingID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFormsBookingEdit'] = true;
    const { params: { bookingID }} = request;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestBookingContent(bookingID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/forms/booking/booking.admin.hbs`;
    response.render(template, data);
});

router.get(`/contact-us`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFormsContacts'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestContactsList()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/forms/contact-us/contact-us-list.admin.hbs`;
    response.render(template, data);
});

router.get(`/contact-us/:requestID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFormsContactsEdit'] = true;
    const { params: { requestID }} = request;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestContactsContent(requestID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/forms/contact-us/contact-us.admin.hbs`;
    response.render(template, data);
});

router.get(`/instant-quote`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFormsQuotes'] = true;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestQuotesList()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/forms/quotes/quotes-list.admin.hbs`;
    response.render(template, data);
});

router.get(`/instant-quote/:requestID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    request.data['layout'] = `admin`;
    request.data['isAdminFormsQuotesEdit'] = true;
    const { params: { requestID }} = request;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestQuotesContent(requestID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/forms/quotes/quotes.admin.hbs`;
    response.render(template, data);
});

// DELETE

router.delete(`/booking/:bookingID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { bookingID }} = request;
    const responseData = await deleteBookingData(bookingID);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/contact-us/:requestID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { requestID }} = request;
    const responseData = await deleteContactsData(requestID);
    setTimeout(() => response.json(responseData), 0);
});

router.delete(`/instant-quote/:requestID`, async (request, response, next) => {
    if (!request.data['userID'] || !request.data['isAdmin']) return next();
    const { params: { requestID }} = request;
    const responseData = await deleteQuotesData(requestID);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;