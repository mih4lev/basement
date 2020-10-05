const { DB } = require("./db.model");

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

module.exports = { saveRequest, saveQuote };