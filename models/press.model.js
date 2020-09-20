const { singleDB, DB } = require("./db.model");

// CREATE

const createPress = async (pageData) => {
    try {
        const query = `INSERT INTO press SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestPress = async ({ limit = 100000 } = {}) => {
    try {
        const query = `
            SELECT 
                pressID, pressTitle, pressAnnounce, pressMagazine, pressImage, 
                DATE_FORMAT(press.timestamp, "%m/%d/%Y") AS pressDate 
            FROM press ORDER BY timestamp DESC LIMIT ?
        `;
        return { press: await DB(query, [ limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestArticle = async (pressID) => {
    try {
        const query = `
            SELECT *, DATE_FORMAT(press.timestamp, "%m/%d/%Y") AS pressDate  
            FROM press WHERE pressID = ?
        `;
        return { page: await singleDB(query, [ pressID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestPressCount = async ({ limit }) => {
    try {
        const query = `
            SELECT COUNT(pressID) as pressCount, IF (COUNT(pressID) > ?, 0, 1) as hiddenButton 
            FROM press
        `;
        return { pressData: await singleDB(query, [ limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updatePress = async ({ pressID, ...updateData }) => {
    try {
        const query = `UPDATE press SET ? WHERE pressID = ?`;
        const response = await DB(query, [ updateData, pressID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(pressID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(pressID), error };
    }
};

// DELETE

const deletePress = async (pressID) => {
    try {
        const query = `DELETE FROM press WHERE pressID = ?`;
        const response = await DB(query, [ pressID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(pressID) };
    } catch (error) {
        console.log(error);
        return { status, requestID: Number(pressID), error };
    }
};

module.exports = {
    createPress, requestPress, requestArticle, requestPressCount, updatePress, deletePress
};