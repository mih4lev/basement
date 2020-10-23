const { DB, singleDB } = require("./db.model");

const requestOffices = async () => {
    try {
        const query = `SELECT * FROM offices`;
        return { offices: await DB(query) };
    } catch (error) {
        return {};
    }
};

const requestOffice = async (pageLink) => {
    try {
        const query = `SELECT * FROM offices WHERE pageLink = ?`;
        return { office: await singleDB(query, [ pageLink ]) };
    } catch (error) {
        return {};
    }
};

module.exports = { requestOffices, requestOffice };