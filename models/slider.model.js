const { DB } = require("./db.model");

const requestSliders = async () => {
    try {
        const query = `SELECT * FROM slider ORDER BY timestamp`;
        return { sliders: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestSliders };