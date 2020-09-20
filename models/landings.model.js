const { singleDB, DB } = require("./db.model");

// CREATE

const createLanding = async (pageData) => {
    try {
        const query = `INSERT INTO landings SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestLandings = async () => {
    try {
        const query = `SELECT landingID, pageURL, landingImage FROM landings`;
        return { landings: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestLanding = async (searchParam, isURL = true) => {
    try {
        const query = `
            SELECT landingID, pageURL, pageTitle, pageDescription, pageKeywords, headerTitle, 
                   headerText, landingImage, footerTitle, footerText, lat, lng, zoom
            FROM landings WHERE ?? = ?
        `;
        const data = (isURL) ? [`pageURL`, searchParam] : [`landingID`, searchParam];
        return { page: await singleDB(query, data) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateLanding = async ({ landingID, ...updateData }) => {
    try {
        const query = `UPDATE landings SET ? WHERE landingID = ?`;
        const response = await DB(query, [updateData, landingID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(landingID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// DELETE

const deleteLanding = async (landingID) => {
    try {
        const query = `DELETE FROM landings WHERE landingID = ?`;
        const response = await DB(query, [landingID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(landingID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    createLanding, requestLandings, requestLanding, updateLanding, deleteLanding
};