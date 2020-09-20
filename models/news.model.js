const { singleDB } = require("./db.model");

const requestNews = async () => {
    try {
        const query = `
            SELECT article, DATE_FORMAT(timestamp, "%M %d, %Y") AS articleDate,
                   YEAR(CURRENT_TIMESTAMP) AS articleYear
            FROM news ORDER BY timestamp LIMIT 1
        `;
        return { news: await singleDB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestNews };