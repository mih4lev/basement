const { DB, singleDB } = require("./db.model");

// REQUEST

const requestQuotes = async () => {
    try {
        const query = `SELECT * FROM quotes ORDER BY timestamp`;
        return { quotes: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestQuote = async (pageURL) => {
    try {
        const query = `SELECT * FROM quotes WHERE pageURL = ?`;
        return { page: await singleDB(query, [pageURL]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = {
    requestQuotes, requestQuote
};