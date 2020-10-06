const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestCalendar, addEvent } = require("../../models/calendar.model");
const { saveBooking, requestUserByZipCode, tempRedirect } = require("../../models/booking.model");
const { checkBookingData } = require("../../controllers/booking.controller");

// API /api/booking - POST
router.post(`/`, formParser.none(), async (request, response) => {
    const { body: { zipCode }} = request;
    // const responseData = await requestUserByZipCode(zipCode);
    // const { userID, timeStart, timeEnd } = responseData;
    // if (!userID) return response.json({ status: 0 });
    // const calendar = await requestCalendar(userID);
    // const data = { status: 1, calendar, userID, timeStart, timeEnd };
    const data = await tempRedirect(zipCode); // TEMP function for 'youcanbookme' redirects
    setTimeout(() => response.json(data), 0);
});

// API /api/booking/calendar
router.post(`/calendar`, formParser.none(), async (request, response) => {
    const { body: { userID }} = request;
    const calendar = await requestCalendar(userID);
    const data = { status: 1, calendar, userID };
    setTimeout(() => response.json(data), 0);
});

// API /api/booking/form
router.post(`/form`, formParser.none(), async (request, response) => {
    try {
        const formData = checkBookingData(request.body);
        const data = await saveBooking(formData);
        await addEvent(formData);
        setTimeout(() => response.json(data), 0);
    } catch (error) {
        response.json({ status: 0, error: error.toString() });
    }
});

module.exports = router;