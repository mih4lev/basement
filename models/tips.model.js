const { DB, singleDB } = require("./db.model");

// CREATE

const createTip = async (pageData) => {
    try {
        const query = `INSERT INTO tips SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

const createCategory = async (pageData) => {
    try {
        const query = `INSERT INTO tips_categories SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestTips = async ({ limit = 100000 } = {}) => {
    try {
        const query = `
            SELECT 
                tips.tipID, tips.tipTitle, tips.tipAnnounce, tips.tipImage, tips.categoryID, 
                DATE_FORMAT(tips.timestamp, "%m/%d/%Y") AS tipDate, tips_categories.categoryName
            FROM tips 
            LEFT JOIN tips_categories ON tips.categoryID = tips_categories.categoryID
            ORDER BY tips.timestamp DESC LIMIT ?
        `;
        const tips = await DB(query, [ limit ]);
        if (tips.length) tips[0].isFirstCard = true;
        return { tips };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestFilteredTips = async ({ categories, limit = 100000 } = {}) => {
    try {
        const query = `
            SELECT 
                tips.tipID, tips.tipTitle, tips.tipAnnounce, tips.tipImage, tips.categoryID, 
                DATE_FORMAT(tips.timestamp, "%m/%d/%Y") AS tipDate, tips_categories.categoryName
            FROM tips 
            LEFT JOIN tips_categories ON tips.categoryID = tips_categories.categoryID
            WHERE tips.categoryID IN (?)
            ORDER BY tips.timestamp DESC LIMIT ?
        `;
        return { tips: await DB(query, [ categories, limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestTip = async (tipID) => {
    try {
        const query = `
            SELECT 
                tips.tipID, tips.pageTitle, tips.pageDescription, tips.pageKeywords,
                tips.tipTitle, tips.tipImage, tips.tipAnnounce, tips.tipText, tips.categoryID,
                tips.portfolioID, tips_categories.categoryName, 
                DATE_FORMAT(tips.timestamp, "%m/%d/%Y") AS tipDate 
            FROM tips LEFT JOIN tips_categories ON tips.categoryID = tips_categories.categoryID
            WHERE tipID = ? 
        `;
        return { page: await singleDB(query, [ tipID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategories = async () => {
    try {
        const query = `
            SELECT 
                tips_categories.categoryID, tips_categories.categoryName, 
                (
                    SELECT COUNT(*) FROM tips WHERE 
                    tips.categoryID = tips_categories.categoryID
                ) AS tipsCount,
                IF ((
                    SELECT COUNT(*) FROM tips 
                    WHERE tips.categoryID = tips_categories.categoryID
                ) > 0, 1, 0) AS tipsExist
            FROM tips_categories
        `;
        return { categories: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestTipsCount = async ({ limit }) => {
    try {
        const query = `
            SELECT COUNT(tipID) as tipsCount, IF (COUNT(tipID) > ?, 0, 1) as hiddenButton FROM tips
        `;
        return { tipsData: await singleDB(query, [ limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateTip = async ({ tipID, ...updateData }) => {
    try {
        const query = `UPDATE tips SET ? WHERE tipID = ?`;
        const response = await DB(query, [ updateData, tipID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(tipID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(tipID), error };
    }
};

const updateCategory = async ({ categoryID, ...updateData }) => {
    try {
        const query = `UPDATE tips_categories SET ? WHERE categoryID = ?`;
        const response = await DB(query, [ updateData, categoryID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(categoryID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(categoryID), error };
    }
};

// DELETE

const deleteTip = async (tipID) => {
    try {
        const query = `DELETE FROM tips WHERE tipID = ?`;
        const response = await DB(query, [ tipID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(tipID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(tipID), error };
    }
};

const deleteCategory = async ({ categoryID }) => {
    try {
        const query = `DELETE FROM tips_categories WHERE categoryID = ?`;
        const response = await DB(query, [ categoryID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(categoryID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(categoryID), error };
    }
};

module.exports = {
    createTip, createCategory, requestTips, requestTip, requestCategories, requestTipsCount,
    requestFilteredTips, updateTip, updateCategory, deleteTip, deleteCategory
};