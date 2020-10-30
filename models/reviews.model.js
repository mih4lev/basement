const { DB, singleDB } = require("./db.model");

// CREATE

const addReviewPage = async (pageData) => {
    try {
        const query = `INSERT INTO reviews SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

// REQUEST

const requestReviewPages = async () => {
    try {
        const query = `SELECT * FROM reviews`;
        return { reviewPages: await DB(query) };
    } catch (error) {
        return {};
    }
};

const requestReviewPage = async (pageLink) => {
    try {
        const query = `SELECT * FROM reviews WHERE pageLink = ?`;
        return { page: await singleDB(query, [ pageLink ]) };
    } catch (error) {
        return {};
    }
};

const requestReviewPageByID = async (officeID) => {
    try {
        const query = `SELECT * FROM reviews WHERE reviewID = ?`;
        return { reviewPage: await singleDB(query, [ officeID ]) };
    } catch (error) {
        return {};
    }
};

// UPDATE

const updateReviewPage = async ({ reviewID, ...updateData }) => {
    try {
        const query = `UPDATE reviews SET ? WHERE reviewID = ?`;
        const response = await DB(query, [ updateData, reviewID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(reviewID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(reviewID), error };
    }
};

// DELETE

const deleteReviewPage = async (reviewID) => {
    try {
        const query = `DELETE FROM reviews WHERE reviewID = ?`;
        const response = await DB(query, [reviewID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(reviewID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    addReviewPage, requestReviewPages, requestReviewPage,
    requestReviewPageByID, updateReviewPage, deleteReviewPage
};