const { DB, singleDB } = require("./db.model");

// CREATE

const saveBooking = async (bookingData) => {
    try {
        const query = `INSERT INTO booking SET ?`;
        const response = await DB(query, bookingData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

const requestUserByZipCode = async (zipCode) => {
    try {
        const query = `SELECT * FROM calendars WHERE ? IN (zipCodes)`;
        return { ...(await singleDB(query, [ Number(zipCode) ])) };
    } catch (error) {
        return { status: 0, error };
    }
};

module.exports = { saveBooking, requestUserByZipCode };