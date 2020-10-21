const { singleDB, DB } = require("./db.model");

// CREATE

const saveRequest = async (requestData) => {
    try {
        const query = `INSERT INTO requests SET ?`;
        const response = await DB(query, requestData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

const saveQuote = async (quoteData) => {
    try {
        const query = `INSERT INTO quotes_requests SET ?`;
        const response = await DB(query, quoteData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

// REQUESTS

const requestBookingList = async () => {
    try {
        const query = `
            SELECT 
                bookingID, firstName, lastName, phone, email, address, town, state, 
                zipCode, service, square, budget, message, referer, spec, 
                DATE_FORMAT(CONVERT_TZ(date,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS date,
                DATE_FORMAT(CONVERT_TZ(timestamp,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS timestamp
            FROM booking ORDER BY timestamp DESC
        `;
        return { forms: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestBookingContent = async (bookingID) => {
    try {
        const query = `
            SELECT 
                bookingID, firstName, lastName, phone, email, address, town, state, 
                zipCode, service, square, budget, message, referer, spec, 
                DATE_FORMAT(CONVERT_TZ(date,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS date,
                DATE_FORMAT(CONVERT_TZ(timestamp,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS timestamp
            FROM booking WHERE bookingID = ?
        `;
        return { form: await singleDB(query, [ bookingID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestContactsList = async () => {
    try {
        const query = `
            SELECT
                requestID, firstName, lastName, email, phone, zipCode, service, message, 
                consultationTime, developStart, budget, referer, 
                DATE_FORMAT(CONVERT_TZ(timestamp,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS timestamp
            FROM requests ORDER BY timestamp DESC
        `;
        return { forms: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestContactsContent = async (requestID) => {
    try {
        const query = `
            SELECT
                requestID, firstName, lastName, email, phone, zipCode, service, message, 
                consultationTime, developStart, budget, referer, 
                DATE_FORMAT(CONVERT_TZ(timestamp,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS timestamp
            FROM requests WHERE requestID = ?
        `;
        return { form: await singleDB(query, [ requestID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestQuotesList = async () => {
    try {
        const query = `
            SELECT 
                requestID, firstName, lastName, email, square, zipCode, bathroomExist,
                demolitionRequired, kitchenExist, isHeightOver, referer, 
                DATE_FORMAT(CONVERT_TZ(timestamp,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS timestamp
            FROM quotes_requests ORDER BY timestamp DESC
        `;
        return { forms: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestQuotesContent = async (requestID) => {
    try {
        const query = `
            SELECT
                requestID, firstName, lastName, email, square, zipCode, bathroomExist,
                demolitionRequired, kitchenExist, isHeightOver, referer, 
                DATE_FORMAT(CONVERT_TZ(timestamp,'+03:00','-04:00'), "%m/%d/%Y %h:%i %p") AS timestamp
            FROM quotes_requests WHERE requestID = ?
        `;
        return { form: await singleDB(query, [ requestID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// DELETE

const deleteBookingData = async (bookingID) => {
    try {
        const query = `DELETE FROM booking WHERE bookingID = ?`;
        const response = await DB(query, [bookingID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(bookingID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(bookingID), error };
    }
};

const deleteContactsData = async (requestID) => {
    try {
        const query = `DELETE FROM requests WHERE requestID = ?`;
        const response = await DB(query, [requestID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(requestID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(requestID), error };
    }
};

const deleteQuotesData = async (requestID) => {
    try {
        const query = `DELETE FROM quotes_requests WHERE requestID = ?`;
        const response = await DB(query, [requestID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(requestID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(requestID), error };
    }
};

module.exports = {
    saveRequest, saveQuote, requestBookingList, requestContactsList, requestQuotesList,
    requestBookingContent, requestContactsContent, requestQuotesContent,
    deleteBookingData, deleteContactsData, deleteQuotesData
};