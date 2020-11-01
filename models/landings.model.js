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

const createSlide = async (slideData) => {
    try {
        const query = `INSERT INTO slider SET ?`;
        const response = await DB(query, slideData);
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
        const query = `SELECT landingID, pageURL, pageTitle, landingImage FROM landings`;
        return { landings: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestLanding = async (searchParam, isURL = true) => {
    try {
        const query = `SELECT * FROM landings WHERE ?? = ?`;
        const data = (isURL) ? [`pageURL`, searchParam] : [`landingID`, searchParam];
        return { page: await singleDB(query, data) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestSlider = async () => {
    try {
        const query = `SELECT * FROM slider ORDER BY position`;
        return { slider: await DB(query) };
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

const updateSlide = async ({ sliderID, ...updateData }) => {
    try {
        const query = `UPDATE slider SET ? WHERE sliderID = ?`;
        const response = await DB(query, [updateData, sliderID]);
        const { sliderImage } = updateData;
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(sliderID), sliderImage };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

const updatePositions = async (requestData) => {
    try {
        const promises = [];
        for (const sliderID in requestData) {
            const updateData = { position: requestData[sliderID] };
            const query = `UPDATE slider SET ? WHERE sliderID = ?`;
            promises.push(DB(query, [updateData, sliderID]))
        }
        await Promise.all(promises);
        return { status: 1 };
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

const deleteSlide = async (sliderID) => {
    try {
        const query = `DELETE FROM slider WHERE sliderID = ?`;
        const response = await DB(query, [sliderID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(sliderID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    createLanding, createSlide, requestLandings, requestLanding, requestSlider,
    updateLanding, updateSlide, updatePositions, deleteLanding, deleteSlide
};