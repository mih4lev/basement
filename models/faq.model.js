const { DB } = require("./db.model");

const requestFAQ = async () => {
    try {
        const query = `SELECT ourTitle, ourText, otherTitle, otherText, faqIcon FROM faq`;
        return { faq: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestFAQ };