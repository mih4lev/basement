const { DB } = require("./db.model");

// CREATE

const saveUploadImage = async (pageData) => {
    try {
        const query = `INSERT INTO upload SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// UPDATE

const updateUploadImage = async ({ uploadID, ...updateData }) => {
    try {
        const query = `UPDATE upload SET ? WHERE uploadID = ?`;
        const response = await DB(query, [updateData, uploadID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(uploadID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(uploadID), error };
    }
};

module.exports = {
    saveUploadImage, updateUploadImage
};