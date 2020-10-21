const { DB, singleDB } = require("./db.model");

// CREATE

const addZipCodes = async (addData) => {
    try {
        const query = `INSERT INTO zip_codes SET ?`;
        const response = await DB(query, addData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

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

// REQUEST

const requestZipCodes = async () => {
    try {
        const query = `SELECT * FROM zip_codes`;
        return { zipCodes: await DB(query) };
    } catch (error) {
        return { status: 0, error };
    }
};

const requestUserByZipCode = async (zipCode) => {
    try {
        const query = `SELECT * FROM calendars WHERE zipCodes LIKE '%?%'`;
        return { ...(await singleDB(query, [ Number(zipCode) ])) };
    } catch (error) {
        return { status: 0, error };
    }
};

const tempBookingRedirect = async (zipCode) => {
    try {
        const query = `SELECT link FROM zip_codes WHERE codes LIKE '%?%'`;
        const data = await singleDB(query, [ Number(zipCode) ]);
        const status = (data.link) ? 1 : 0;
        return { ...data, status };
    } catch (error) {
        return { status: 0, error: error.toString() };
    }
};

// UPDATE

const updateZipCodes = async ({ codeID, ...updateData }) => {
    try {
        const query = `UPDATE zip_codes SET ? WHERE codeID = ?`;
        const response = await DB(query, [ updateData, codeID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(codeID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(codeID), error };
    }
};

// DELETE

const deleteZone = async (codeID) => {
    try {
        const query = `DELETE FROM zip_codes WHERE codeID = ?`;
        const response = await DB(query, [codeID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(codeID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    addZipCodes, saveBooking, requestZipCodes, requestUserByZipCode,
    tempBookingRedirect, updateZipCodes, deleteZone
};