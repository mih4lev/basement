const { DB } = require("./db.model");

// CREATE

const createAlbum = async (albumData) => {
    try {
        const query = `INSERT INTO albums SET ?`;
        const response = await DB(query, albumData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

const createRelation = async (relationData) => {
    try {
        const query = `INSERT INTO albums_relation SET ?`;
        const response = await DB(query, relationData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestUserAlbums = async (userID) => {
    try {
        const query = `
            SELECT 
                albums.albumID, albums.albumTitle, albums.albumCover, 
                COUNT(albums_relation.relationID) AS albumCount 
            FROM albums 
            LEFT JOIN albums_relation ON albums.albumID = albums_relation.albumID 
            LEFT JOIN ideas ON albums_relation.ideaID = ideas.ideaID 
            WHERE albums.userID = ? GROUP BY albums.albumTitle
        `;
        return { albums: await DB(query, [userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestSavedAlbums = async (ideaID, userID) => {
    try {
        const query = `
            SELECT 
                albums.albumID, albums.albumTitle, albums.albumCover, 
                COUNT(albums_relation.relationID) AS albumCount, 
                (
                    SELECT albums_relation.relationID FROM albums_relation 
                    WHERE albums_relation.albumID = albums.albumID && albums_relation.ideaID = ?
                ) as isSaved 
            FROM albums 
            LEFT JOIN albums_relation ON albums.albumID = albums_relation.albumID 
            LEFT JOIN ideas ON albums_relation.ideaID = ideas.ideaID 
            WHERE albums.userID = ? GROUP BY albums.albumTitle
        `;
        return { albums: await DB(query, [ideaID, userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

//

// UPDATE

const updateAlbum = async ({ albumID, ...updateData }) => {
    try {
        const query = `UPDATE albums SET ? WHERE albumID = ?`;
        const response = await DB(query, [updateData, albumID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(albumID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// DELETE

const deleteAlbum = async (albumID) => {
    try {
        const query = `DELETE FROM albums WHERE albumID = ?`;
        const response = await DB(query, [albumID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(albumID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

const deleteRelations = async (userID, ideaID, albumID) => {
    try {
        const ideaQuery = `DELETE FROM albums_relation WHERE userID = ? && ideaID = ?`;
        const albumQuery = `DELETE FROM albums_relation WHERE userID = ? && ideaID = ? && albumID = ?`;
        const query = (albumID) ? albumQuery : ideaQuery;
        const params = (albumID) ? [userID, ideaID, albumID] : [userID, ideaID];
        const response = await DB(query, params);
        const status = Number(response.affectedRows && response.affectedRows >= 1);
        return { status, requestID: Number(ideaID) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

module.exports = {
    createAlbum, createRelation, requestUserAlbums, requestSavedAlbums,
    updateAlbum, deleteAlbum, deleteRelations
};