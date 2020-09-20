const { DB, singleDB } = require("./db.model");

// REQUEST

const requestMeta = async (pageID) => {
    try {
        const query = `
            SELECT pageID, pageTitle, pageDescription, pageKeywords 
            FROM pages WHERE pageID = ?
        `;
        return { page: await singleDB(query, [pageID])};
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateMeta = async ({ pageID, ...updateData }) => {
    try {
        const query = `UPDATE pages SET ? WHERE pageID = ?`;
        const response = await DB(query, [updateData, pageID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, pageID: Number(pageID) };
    } catch (error) {
        console.log(error);
        return { status: 0, pageID: Number(pageID), error };
    }
};

module.exports = { requestMeta, updateMeta };