const { DB } = require("./db.model");

const requestSteps = async () => {
    try {
        const query = `SELECT stepID, stepTitle, stepDay, stepCover FROM steps`;
        return { steps: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestSteps };