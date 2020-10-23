const { DB, singleDB } = require("./db.model");

// CREATE

const addOffice = async (officeData) => {
    try {
        const query = `INSERT INTO offices SET ?`;
        const response = await DB(query, officeData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

// REQUEST

const requestOffices = async () => {
    try {
        const query = `SELECT * FROM offices`;
        return { offices: await DB(query) };
    } catch (error) {
        return {};
    }
};

const requestOffice = async (pageLink) => {
    try {
        const query = `SELECT * FROM offices WHERE pageLink = ?`;
        return { office: await singleDB(query, [ pageLink ]) };
    } catch (error) {
        return {};
    }
};

const requestOfficeByID = async (officeID) => {
    try {
        const query = `SELECT * FROM offices WHERE officeID = ?`;
        return { office: await singleDB(query, [ officeID ]) };
    } catch (error) {
        return {};
    }
};

// UPDATE

const updateOffice = async ({ officeID, ...updateData }) => {
    try {
        const query = `UPDATE offices SET ? WHERE officeID = ?`;
        const response = await DB(query, [ updateData, officeID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(officeID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(officeID), error };
    }
};

// DELETE

const deleteOffice = async (officeID) => {
    try {
        const query = `DELETE FROM offices WHERE officeID = ?`;
        const response = await DB(query, [officeID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(officeID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    addOffice, requestOffices, requestOffice, requestOfficeByID, updateOffice, deleteOffice
};