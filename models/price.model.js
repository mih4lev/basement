const { DB } = require("./db.model");

const requestPrice = async () => {
    try {
        const query = `SELECT priceID, priceTitle, priceValue, priceCover, priceFields FROM price`;
        const price = await DB(query);
        price.forEach((field) => field.priceFields = field.priceFields.split(`, `));
        return { price };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestPrice };