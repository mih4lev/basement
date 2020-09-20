const { DB } = require("./db.model");

const requestLicenses = async () => {
    try {
        const query = `SELECT licenseTitle, licenseCover FROM licenses`;
        return { licenses: await DB(query) };
    } catch(error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestLicenses };