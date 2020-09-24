const { DB, singleDB } = require("./db.model");

// CREATE

const createUser = async (userData) => {
    try {
        const query = `INSERT INTO users SET ?`;
        const response = await DB(query, userData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestUsers = async (userID) => {
    try {
        const query = `
            SELECT 
                userID, avatarImage, isAdmin, isSpec,
                CONCAT(users.name, ' ', users.surname) as user,
                IF (googleID IS NOT NULL, 1, 0) as isGoogle, 
                IF (facebookID IS NOT NULL, 1, 0) as isFacebook
            FROM users
        `;
        return { users: await DB(query, [userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestUser = async (userID) => {
    try {
        const query = `
            SELECT 
                *, YEAR(membership) as year, 
                IF (ISNULL(avatarImage), false, true) as isAvatarExist,
                CONCAT(users.name, ' ', users.surname) as user
            FROM users WHERE userID = ?
        `;
        return { profile: await singleDB(query, [userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestUserData = async (userID) => {
    try {
        const query = `
            SELECT * FROM users WHERE userID = ?
        `;
        return { user: await singleDB(query, [userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestAuthorize = async (mail) => {
    try {
        const query = `SELECT userID, password, salt FROM users WHERE mail = ?`;
        return { ...(await singleDB(query, [mail])) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const checkMail = async (mail) => {
    try {
        const query = `SELECT userID FROM users WHERE mail = ?`;
        return { ...(await singleDB(query, [mail])) };
    } catch (error) {
        console.log(error);
        return {};
    }
}

const requestFacebookAuthorize = async (facebookID) => {
    try {
        const query = `SELECT userID FROM users WHERE facebookID = ?`;
        const userData = await singleDB(query, [facebookID]);
        return { ...userData };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestGoogleAuthorize = async (googleID) => {
    try {
        const query = `SELECT userID FROM users WHERE googleID = ?`;
        const userData = await singleDB(query, [googleID]);
        return { ...userData };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateUser = async ({ userID, ...updateData }) => {
    try {
        console.log(updateData);
        const query = `UPDATE users SET ? WHERE userID = ?`;
        const response = await DB(query, [updateData, userID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(userID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// DELETE

const deleteUser = async (userID) => {
    try {
        const query = `DELETE FROM users WHERE userID = ?`;
        const response = await DB(query, [userID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(userID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    createUser, requestUsers, requestUser, requestUserData, requestAuthorize, checkMail,
    requestFacebookAuthorize, requestGoogleAuthorize, updateUser, deleteUser
};