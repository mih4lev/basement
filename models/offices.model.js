const { DB } = require("./db.model");

const requestOffices = async () => {
    try {
        const query = `SELECT officeTitle, officeAddress, lat, lng, zoom FROM offices`;
        return { offices: await DB(query) };
    } catch (error) {
        return {};
    }
};

module.exports = { requestOffices };