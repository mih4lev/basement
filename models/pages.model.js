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

const requestTextContent = async (pageID) => {
    try {
        const query = `SELECT fieldTitle, fieldContent FROM text_content WHERE pageID = ?`;
        const data = await DB(query, [pageID]);
        const content = {};
        data.forEach(({ fieldTitle, fieldContent }) => content[fieldTitle] = fieldContent);
        return { content };
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

const updateContent = async (content) => {
    try {
        for (const fieldName in content) {
            if (content.hasOwnProperty(fieldName)) {
                const data = { fieldContent: content[fieldName] };
                const query = `UPDATE text_content SET ? WHERE fieldTitle = ?`;
                await DB(query, [data, fieldName]);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { requestMeta, requestTextContent, updateMeta, updateContent };