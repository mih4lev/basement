const { DB } = require("./db.model");

const requestAwards = async (limit = 1000) => {
    try {
        const query = `SELECT awardImage, awardTitle FROM awards ORDER BY timestamp LIMIT ?`;
        return { awards: await DB(query, [limit]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestAwards };