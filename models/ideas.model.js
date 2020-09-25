const { DB, singleDB } = require("./db.model");

// CREATE

const createIdea = async ({ categoryArray, filterArray, ...ideaData }) => {
    try {
        const query = `INSERT INTO ideas SET ?`;
        const response = await DB(query, ideaData);
        const ideaID = response.insertId;
        // add categories
        let categories = [];
        if (typeof categoryArray === `string`) categories.push(categoryArray);
        if (typeof categoryArray === `object`) categories = [ ...categoryArray ];
        for (const categoryID of categories) {
            const relationData = { ideaID, categoryID: Number(categoryID) };
            const query = `INSERT INTO ideas_relation SET ?`;
            await DB(query, relationData);
        }
        // add filters
        let filters = [];
        if (typeof filterArray === `string`) filters.push(filterArray);
        if (typeof filterArray === `object`) filters = [ ...filterArray ];
        for (const filterID of filters) {
            const relationData = { ideaID, filterID: Number(filterID) };
            const query = `INSERT INTO ideas_properties SET ?`;
            await DB(query, relationData);
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(ideaID) };
    } catch (error) {
        return { status: 0, error };
    }
};

const addCreator = async (pageData) => {
    try {
        const query = `INSERT INTO ideas_creators SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

// REQUEST

const requestCategoryIdeasByID = async (requestData) => {
    try {
        const { categoryID, userID = 0, limit = 1000, order = `ideaID` } = requestData;
        const query = `
            SELECT 
                ideas.ideaID as ideaID, ideas.ideaTitle, ideas.ideaImage, 
                CONCAT(users.name, ' ', users.surname) as ideaAuthor, 
                ideas_creators.creatorName as ideaCreator, 
                (
                    SELECT COUNT(albums_relation.relationID) 
                    FROM albums_relation WHERE ideas.ideaID = albums_relation.ideaID
                ) as popular,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas_relation 
            LEFT JOIN ideas_categories ON ideas_relation.categoryID = ideas_categories.categoryID 
            LEFT JOIN ideas_categories AS cat1 ON ideas_categories.categoryParent = cat1.categoryID 
            lEFT JOIN ideas_categories AS cat2 ON cat1.categoryParent = cat2.categoryID 
            LEFT JOIN ideas ON ideas.ideaID = ideas_relation.ideaID 
            LEFT JOIN users ON users.userID = ideas.userID 
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID 
            WHERE ( 
                cat2.categoryID = ? || cat1.categoryID = ? || ideas_categories.categoryID = ? 
            ) && ideas.isModerated = 1 
            GROUP BY ideas.ideaID 
            ORDER BY ?? DESC 
            LIMIT ?
        `;
        const params = [userID, userID, categoryID, categoryID, categoryID, order, limit];
        return { ideas: await DB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategoryFilteredIdeasByID = async (requestData) => {
    try {
        const { categoryID, filterArray, userID = 0, order = `ideaID`, limit = 1000 } = requestData;
        const query = `
            SELECT 
                ideas.ideaID as ideaID, ideas.ideaTitle, ideas.ideaImage, 
                CONCAT(users.name, ' ', users.surname) as ideaAuthor,
                ideas_creators.creatorName as ideaCreator,
                (
                    SELECT COUNT(albums_relation.relationID) 
                    FROM albums_relation WHERE ideas.ideaID = albums_relation.ideaID
                ) as popular,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas_relation 
            LEFT JOIN ideas_categories ON ideas_relation.categoryID = ideas_categories.categoryID
            LEFT JOIN ideas_categories AS cat1 ON ideas_categories.categoryParent = cat1.categoryID
            lEFT JOIN ideas_categories AS cat2 ON cat1.categoryParent = cat2.categoryID
            LEFT JOIN ideas ON ideas.ideaID = ideas_relation.ideaID 
            LEFT JOIN users ON users.userID = ideas.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            JOIN ideas_properties as filters ON ideas.ideaID = filters.ideaID
            WHERE (
                cat2.categoryID = ? || 
                cat1.categoryID = ? || 
                ideas_categories.categoryID = ?
            ) && ideas.isModerated = 1 && filters.filterID IN (?)
            GROUP BY ideas.ideaID 
            ORDER BY ?? DESC
            LIMIT ?
        `;
        const params = [userID, userID, categoryID, categoryID, categoryID, filterArray, order, limit];
        return { ideas: await DB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategoryIdeasByURL = async (requestData) => {
    try {
        const { categoryURL, userID = 0, limit = 1000, order = `ideaID` } = requestData;
        const query = `
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage, 
                CONCAT(users.name, ' ', users.surname) as ideaAuthor,
                ideas_creators.creatorName as ideaCreator,
                (
                    SELECT COUNT(albums_relation.relationID) 
                    FROM albums_relation WHERE ideas.ideaID = albums_relation.ideaID
                ) as popular,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas_relation 
            LEFT JOIN ideas_categories ON ideas_relation.categoryID = ideas_categories.categoryID
            LEFT JOIN ideas_categories AS cat1 ON ideas_categories.categoryParent = cat1.categoryID
            lEFT JOIN ideas_categories AS cat2 ON cat1.categoryParent = cat2.categoryID
            LEFT JOIN ideas ON ideas.ideaID = ideas_relation.ideaID 
            LEFT JOIN users ON users.userID = ideas.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            WHERE (
                cat2.categoryID = (
                    SELECT ideas_categories.categoryID 
                    FROM ideas_categories WHERE ideas_categories.categoryLink = ?
                ) || 
                cat1.categoryID = (
                    SELECT ideas_categories.categoryID 
                    FROM ideas_categories WHERE ideas_categories.categoryLink = ?
                ) || 
                ideas_categories.categoryID = (
                    SELECT ideas_categories.categoryID 
                    FROM ideas_categories WHERE ideas_categories.categoryLink = ?
                )
            ) && ideas.isModerated = 1
            GROUP BY ideas.ideaID 
            ORDER BY ?? DESC
            LIMIT ?
        `;
        const params = [ userID, userID, categoryURL, categoryURL, categoryURL, order, limit ];
        return { ideas: await DB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategoryFilteredIdeasByURL = async (requestData) => {
    try {
        const { categoryURL, filterArray, userID = 0, limit = 1000 } = requestData;
        const query = `
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage, 
                CONCAT(users.name, ' ', users.surname) as ideaAuthor,
                ideas_creators.creatorName as ideaCreator,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas_relation 
            LEFT JOIN ideas_categories ON ideas_relation.categoryID = ideas_categories.categoryID
            LEFT JOIN ideas_categories AS cat1 ON ideas_categories.categoryParent = cat1.categoryID
            lEFT JOIN ideas_categories AS cat2 ON cat1.categoryParent = cat2.categoryID
            LEFT JOIN ideas ON ideas.ideaID = ideas_relation.ideaID 
            LEFT JOIN users ON users.userID = ideas.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            JOIN ideas_properties as filters ON ideas.ideaID = filters.ideaID
            WHERE (
                    cat2.categoryID = (
                        SELECT ideas_categories.categoryID 
                        FROM ideas_categories WHERE ideas_categories.categoryLink = ?
                    ) || 
                    cat1.categoryID = (
                        SELECT ideas_categories.categoryID 
                        FROM ideas_categories WHERE ideas_categories.categoryLink = ?
                    ) || 
                    ideas_categories.categoryID = (
                        SELECT ideas_categories.categoryID 
                        FROM ideas_categories WHERE ideas_categories.categoryLink = ?
                    )
                ) && ideas.isModerated = 1 && filters.filterID IN (?)
            GROUP BY ideas.ideaID 
            ORDER BY ideas.timestamp DESC
            LIMIT ?
        `;
        const params = [userID, userID, categoryURL, categoryURL, categoryURL, filterArray, limit];
        return { ideas: await DB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestAllIdeas = async ({ limit = 1000, userID = 0 } = {}) => {
    try {
        const query = `
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage, ideas.timestamp, 
                IF (
                    ideas_creators.creatorName IS NOT NULL, 
                    ideas_creators.creatorName, 
                    CONCAT(users.name, ' ', users.surname)
                ) as ideaAuthor,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas 
            JOIN users ON ideas.userID = users.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            ORDER BY ideas.timestamp DESC LIMIT ?
        `;
        return { ideas: await DB(query, [userID, userID, limit]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestIdeas = async ({ limit = 100000, userID = 0, order = `ideaID` } = {}) => {
    try {
        const query = `
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage, ideas.timestamp AS date, 
                IF (
                    ideas_creators.creatorName IS NOT NULL, 
                    ideas_creators.creatorName, 
                    CONCAT(users.name, ' ', users.surname)
                ) as ideaAuthor,
                (
                    SELECT COUNT(albums_relation.relationID) 
                    FROM albums_relation WHERE ideas.ideaID = albums_relation.ideaID
                ) as popular,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas 
            JOIN users ON ideas.userID = users.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            WHERE ideas.isModerated = 1
            ORDER BY ?? DESC LIMIT ?
        `;
        return { ideas: await DB(query, [ userID, userID, order, limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestIdeasCount = async () => {
    try {
        const query = `
            SELECT 
                COUNT(ideaID) AS ideasCount, 
                IF (COUNT(ideaID) <= 12, 1, 0) as hiddenButton
            FROM ideas WHERE isModerated = 1
        `;
        return { ideasData: await singleDB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestHomeIdeas = async ({ userID = 0 } = {}) => {
    try {
        const query = `
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage, ideas.timestamp, 
                IF (
                    ideas_creators.creatorName IS NOT NULL, 
                    ideas_creators.creatorName, 
                    CONCAT(users.name, ' ', users.surname)
                ) as ideaAuthor,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas 
            JOIN users ON ideas.userID = users.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            WHERE ideas.isModerated = 1 && ideas.isHomeIdea = 1
            ORDER BY ideas.timestamp DESC LIMIT 4
        `;
        return { ideas: await DB(query, [userID, userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestModerateIdeas = async ({ limit = 1000, userID = 0 } = {}) => {
    try {
        const query = `
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage, ideas.timestamp, 
                IF (
                    ideas_creators.creatorName IS NOT NULL, 
                    ideas_creators.creatorName, 
                    CONCAT(users.name, ' ', users.surname)
                ) as ideaAuthor,
                IF (ideas.userID = ?, false, true) as isVisible
            FROM ideas 
            JOIN users ON ideas.userID = users.userID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            WHERE ideas.isModerated = 0 
            ORDER BY ideas.timestamp DESC LIMIT ?
        `;
        return { ideas: await DB(query, [userID, limit]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestFilteredIdeas = async ({ limit = 100000, userID = 0, filterArray, order = `ideaID` } = {}) => {
    try {
        const query = `
            SELECT 
                ideas.ideaID as ideaID, ideas.ideaTitle, ideas.ideaImage, ideas.timestamp, 
                IF (
                    ideas_creators.creatorName IS NOT NULL, 
                    ideas_creators.creatorName, 
                    CONCAT(users.name, ' ', users.surname)
                ) as ideaAuthor,
                (
                    SELECT COUNT(albums_relation.relationID) 
                    FROM albums_relation WHERE ideas.ideaID = albums_relation.ideaID
                ) as popular,
                IF (ideas.userID = ?, false, true) as isVisible,
                IF (? = 0, false, true) as isLogin
            FROM ideas 
            JOIN users ON ideas.userID = users.userID
            JOIN ideas_properties as filters ON ideas.ideaID = filters.ideaID
            LEFT JOIN ideas_creators ON ideas_creators.creatorID = ideas.creatorID
            WHERE filters.filterID IN (?)
            GROUP BY ideas.ideaID 
            ORDER BY ?? DESC LIMIT ?
        `;
        return { ideas: await DB(query, [ userID, userID, filterArray, order, limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestUserIdeas = async (userID) => {
    try {
        const query = `           
            SELECT 
                ideas.ideaID, ideas.ideaTitle, ideas.ideaImage,
                CONCAT(users.name, ' ', users.surname) as ideaAuthor
            FROM albums_relation 
            JOIN ideas ON albums_relation.ideaID = ideas.ideaID 
            LEFT JOIN users ON users.userID = ideas.userID
            WHERE albums_relation.userID = ? GROUP BY ideas.ideaID
        `;
        return { ideas: await DB(query, [userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestUploadIdeas = async (userID) => {
    try {
        const query = `
            SELECT ideaID, ideaTitle, ideaImage 
            FROM ideas WHERE userID = ? && portfolioID IS NULL 
            ORDER BY ideaID DESC
        `;
        return { ideas: await DB(query, [userID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestAlbumIdeas = async (albumID) => {
    try {
        const query = `
            SELECT 
                albums_relation.ideaID, ideas.ideaTitle, ideas.ideaImage, albums.albumTitle, 
                albums.albumID, albums.albumCover, users.userID, 
                CONCAT(users.name, ' ', users.surname) as ideaAuthor
            FROM albums_relation 
            JOIN ideas ON albums_relation.ideaID = ideas.ideaID 
            JOIN albums ON albums_relation.albumID = albums.albumID 
            JOIN users ON ideas.userID = users.userID 
            WHERE albums_relation.albumID = ?
        `;
        return { ideas: await DB(query, [albumID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestIdeasByPortfolioID = async (portfolioID) => {
    try {
        const query = `SELECT ideaID FROM ideas WHERE portfolioID = ?`;
        return { ideas: await DB(query, [ portfolioID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestIdea = async (ideaID, userID = 0) => {
    try {
        const query = `
            SELECT 
                ideas.ideaID, ideas.userID, ideas.ideaTitle, ideas.creatorID, ideas.ideaImage,
                ideas.isModerated, ideas.isHomeIdea, ideas.timestamp,
                COUNT(albums_relation.ideaID) AS saveCount, ideas_creators.creatorName,
                CONCAT('/portfolio/', portfolio.workLink) as portfolioLink,
                IF (ideas.userID = ?, false, true) as isVisible, ideas.portfolioID,
                IF (? = 0, false, true) as isLogin,
                IF (
                    ideas_creators.creatorName IS NOT NULL, 
                    ideas_creators.creatorName, 
                    CONCAT(users.name, ' ', users.surname)
                ) as ideaAuthor,
                (
                    SELECT prevIdeas.ideaID FROM ideas as prevIdeas 
                    WHERE prevIdeas.ideaID < ideas.ideaID && prevIdeas.isModerated = 1
                    ORDER BY prevIdeas.ideaID DESC LIMIT 1
                ) as prevID,
                (
                    SELECT nextIdeas.ideaID FROM ideas as nextIdeas 
                    WHERE nextIdeas.ideaID > ideas.ideaID && nextIdeas.isModerated = 1
                    ORDER BY nextIdeas.ideaID ASC LIMIT 1
                ) as nextID
            FROM ideas 
            JOIN users ON users.userID = ideas.userID 
            LEFT JOIN ideas_creators ON ideas.creatorID = ideas_creators.creatorID
            LEFT JOIN albums_relation ON albums_relation.ideaID = ideas.ideaID
            LEFT JOIN portfolio ON portfolio.portfolioID = ideas.portfolioID
            WHERE ideas.ideaID = ?
            GROUP BY albums_relation.ideaID
        `;
        const idea = await singleDB(query, [ userID, userID, ideaID ]);
        if (idea) {
            const categoriesQuery = `
                SELECT 
                    categories.categoryID, categories.categoryTitle, 
                    categories.categoryLink, categories.categoryImage,
                    (
                        SELECT COUNT(*) FROM ideas_relation 
                        WHERE categories.categoryID = ideas_relation.categoryID
                    ) as ideasCount,
                    CONCAT(
                        '/basement-ideas/', 
                        IF (mainCategories.categoryLink IS NOT NULL, mainCategories.categoryLink, ''),
                        IF (mainCategories.categoryLink IS NOT NULL, '/', ''),
                        IF (parentCategories.categoryLink IS NOT NULL, parentCategories.categoryLink, ''),
                        IF (parentCategories.categoryLink IS NOT NULL, '/', ''),
                        categories.categoryLink, '/'
                    ) as categoryLink
                FROM ideas_relation 
                JOIN ideas_categories as categories 
                    ON categories.categoryID = ideas_relation.categoryID
                LEFT JOIN ideas_categories as parentCategories 
                    ON categories.categoryParent = parentCategories.categoryID
                LEFT JOIN ideas_categories as mainCategories 
                    ON parentCategories.categoryParent = mainCategories.categoryID
                WHERE ideaID = ?
                ORDER BY ideasCount DESC
            `;
            idea.categories = await DB(categoriesQuery, [ideaID]);
            for (const category of idea.categories) {
                const { categoryID } = category;
                const similarQuery = `
                    SELECT 
                        ideas.ideaID, ideas.ideaTitle, ideas.ideaImage,
                        (
                            SELECT COUNT(*) FROM albums_relation 
                            WHERE ideas.ideaID = albums_relation.ideaID
                        ) as saveCount
                    FROM ideas_relation 
                    JOIN ideas ON ideas.ideaID = ideas_relation.ideaID
                    WHERE ideas_relation.categoryID = ? && ideas.isModerated = 1 && ideas_relation.ideaID != ?
                    ORDER BY saveCount DESC 
                    LIMIT 12
                `;
                category.similar = await DB(similarQuery, [ categoryID, ideaID ]);
            }
        }
        if (idea) {
            const filtersQuery = `
                SELECT ideas_filters.filterTitle FROM ideas_properties 
                JOIN ideas_filters ON ideas_properties.filterID = ideas_filters.filterID
                WHERE ideas_properties.ideaID = ?
            `;
            const filtersData = await DB(filtersQuery, [ideaID]);
            idea.filters = filtersData.map(({ filterTitle }) => filterTitle );
        }
        if (idea) {
            const portfolioQuery = `
                SELECT 
                    ideas.ideaID, ideas.ideaTitle, ideas.ideaImage,
                    (
                        SELECT COUNT(*) FROM albums_relation 
                        WHERE ideas.ideaID = albums_relation.ideaID
                    ) as saveCount
                FROM ideas
                WHERE 
                    ideas.isModerated = 1 && ideas.ideaID != ? &&
                    ideas.portfolioID = (SELECT portfolioID FROM ideas WHERE ideaID = ?) 
                ORDER BY saveCount DESC
                LIMIT 8
            `;
            idea.portfolio = await DB(portfolioQuery, [ ideaID, ideaID ]);
        }
        return { page: idea };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCreators = async () => {
    try {
        const query = `SELECT creatorID, creatorName FROM ideas_creators`;
        return { creators: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestModerateCount = async () => {
    try {
        const query = `SELECT COUNT(*) as moderateCount FROM ideas WHERE ideas.isModerated = 0`;
        return await singleDB(query);
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateIdea = async (requestData = {}, hasCategories = false, hasFilters = false) => {
    const { ideaID, categoryArray, filterArray, ...updateData } = requestData;
    try {
        const query = `UPDATE ideas SET ? WHERE ideaID = ?`;
        const response = await DB(query, [updateData, ideaID]);
        if (hasCategories) {
            const deleteQuery = `DELETE FROM ideas_relation WHERE ideaID = ?`;
            await DB(deleteQuery, [ideaID]);
            let categories = [];
            if (typeof categoryArray === `string`) categories.push(categoryArray);
            if (typeof categoryArray === `object`) categories = [ ...categoryArray ];
            for (const categoryID of categories) {
                const relationData = { ideaID, categoryID };
                const query = `INSERT INTO ideas_relation SET ?`;
                await DB(query, relationData);
            }
        }
        if (hasFilters) {
            const deleteQuery = `DELETE FROM ideas_properties WHERE ideaID = ?`;
            await DB(deleteQuery, [ideaID]);
            let filters = [];
            if (typeof filterArray === `string`) filters.push(filterArray);
            if (typeof filterArray === `object`) filters = [ ...filterArray ];
            for (const filterID of filters) {
                const relationData = { ideaID, filterID };
                const query = `INSERT INTO ideas_properties SET ?`;
                await DB(query, relationData);
            }
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(ideaID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(ideaID), error };
    }
};

const updateCreator = async ({ creatorID, ...updateData } = {}) => {
    try {
        const query = `UPDATE ideas_creators SET ? WHERE creatorID = ?`;
        const response = await DB(query, [updateData, creatorID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(creatorID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(creatorID), error };
    }
};

// DELETE

const deleteIdea = async (ideaID) => {
    try {
        const query = `DELETE FROM ideas WHERE ideaID = ?`;
        const response = await DB(query, [ideaID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(ideaID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(ideaID), error };
    }
};

const deleteCreator = async ({ creatorID } = {}) => {
    try {
        const query = `DELETE FROM ideas_creators WHERE creatorID = ?`;
        const response = await DB(query, [creatorID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(creatorID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(creatorID), error };
    }
};

module.exports = {
    createIdea, addCreator, requestIdea, requestAlbumIdeas, requestFilteredIdeas,
    requestAllIdeas, requestIdeasCount, requestModerateIdeas, requestIdeas,
    requestIdeasByPortfolioID, requestCategoryIdeasByID, requestCategoryFilteredIdeasByID,
    requestCategoryIdeasByURL, requestCategoryFilteredIdeasByURL, requestModerateCount,
    requestUserIdeas, requestUploadIdeas, requestCreators, requestHomeIdeas, updateIdea,
    updateCreator, deleteIdea, deleteCreator
};