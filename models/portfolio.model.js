const { DB, singleDB } = require("./db.model");

// CREATE

const createWork = async ({ filterArray, portfolioImages, ...portfolioData }) => {
    try {
        const query = `INSERT INTO portfolio SET ?`;
        const response = await DB(query, portfolioData);
        const portfolioID = response.insertId;
        let filters = [];
        if (typeof filterArray === `string`) filters.push(filterArray);
        if (typeof filterArray === `object`) filters = [ ...filterArray ];
        for (const filterID of filters) {
            const query = `INSERT INTO portfolio_properties SET ?`;
            await DB(query, { portfolioID, filterID });
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

const addCreator = async (pageData) => {
    try {
        const query = `INSERT INTO portfolio_creators SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestPortfolio = async (limit = 1000) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, portfolio.workCity, 
                portfolio.workSquare, portfolio.isHomeVisible, portfolio.lat, portfolio.lng,
                ideas.ideaImage as workImage
            FROM portfolio 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID
            ORDER BY portfolio.portfolioID LIMIT ?
        `;
        return { portfolio: await DB(query, [limit]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestFilteredPortfolio = async ({ filters }) => {
    try {
        const { filterArray, square: { 0: minSquare, 1: maxSquare }} = filters;
        const filtersQuery = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, 
                portfolio.workCity, portfolio.workSquare, portfolio.isHomeVisible, 
                portfolio.lat, portfolio.lng, ideas.ideaImage as workImage 
            FROM portfolio_properties 
            JOIN portfolio ON portfolio.portfolioID = portfolio_properties.portfolioID 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID 
            WHERE 
                portfolio_properties.filterID IN (?) && 
                portfolio.workSquare > ? && portfolio.workSquare < ?
            GROUP BY portfolio.portfolioID
            ORDER BY portfolio.portfolioID
        `;
        const squareQuery = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, 
                portfolio.workCity, portfolio.workSquare, portfolio.isHomeVisible, 
                portfolio.lat, portfolio.lng, ideas.ideaImage as workImage 
            FROM portfolio 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID 
            WHERE portfolio.workSquare > ? && portfolio.workSquare < ? 
            ORDER BY portfolio.portfolioID
        `;
        const query = (filterArray) ? filtersQuery : squareQuery;
        const params = (filterArray) ? [filterArray, minSquare, maxSquare] : [minSquare, maxSquare];
        return { portfolio: await DB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestHomePortfolio = async (limit = 1000) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, 
                portfolio.workCity, portfolio.workSquare, portfolio.isHomeVisible, 
                ideas.ideaImage as workImage
            FROM portfolio 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID
            WHERE isHomeVisible = 1 
            ORDER BY portfolio.portfolioID LIMIT ?
        `;
        return { portfolio: await DB(query, [limit]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestWork = async (portfolioID) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.pageTitle, 
                portfolio.pageDescription, portfolio.pageKeywords, portfolio.workTitle, 
                portfolio.workCity, portfolio.creatorID, portfolio.workSquare, portfolio.workImage, 
                portfolio.workText, portfolio.workAddress, portfolio.lat, portfolio.lng, 
                portfolio.isHomeVisible, portfolio_creators.creatorName, 
                (
                    SELECT temp1.workLink FROM portfolio as temp1 
                    WHERE temp1.portfolioID < portfolio.portfolioID
                    ORDER BY temp1.portfolioID DESC LIMIT 1
                ) AS prevLink,
                (
                    SELECT temp2.workLink FROM portfolio as temp2 
                    WHERE temp2.portfolioID > portfolio.portfolioID
                    ORDER BY temp2.portfolioID LIMIT 1
                ) AS nextLink
            FROM portfolio 
            LEFT JOIN portfolio_creators ON portfolio_creators.creatorID = portfolio.creatorID
            WHERE portfolioID = ?
        `;
        const workData = await singleDB(query, [ portfolioID ]);
        return { page: workData };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestWorkByLink = async (workLink) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.pageTitle, 
                portfolio.pageDescription, portfolio.pageKeywords, portfolio.workTitle, 
                portfolio.workCity, portfolio.creatorID, portfolio.workSquare, portfolio.workImage, 
                portfolio.workText, portfolio.workAddress, portfolio.lat, portfolio.lng, 
                portfolio.isHomeVisible, portfolio_creators.creatorName, 
                (
                    SELECT temp1.workLink FROM portfolio as temp1 
                    WHERE temp1.portfolioID < portfolio.portfolioID
                    ORDER BY temp1.portfolioID DESC LIMIT 1
                ) AS prevLink,
                (
                    SELECT temp2.workLink FROM portfolio as temp2 
                    WHERE temp2.portfolioID > portfolio.portfolioID
                    ORDER BY temp2.portfolioID LIMIT 1
                ) AS nextLink
            FROM portfolio 
            LEFT JOIN portfolio_creators ON portfolio_creators.creatorID = portfolio.creatorID
            WHERE portfolio.workLink = ?
        `;
        const workData = await singleDB(query, [ workLink ]);
        const { portfolioID } = workData;
        const imagesQuery = `
            SELECT ideas.ideaImage, ideas.ideaID, ideas.ideaTitle
            FROM ideas WHERE ideas.portfolioID = ?
        `;
        workData.images = await DB(imagesQuery, [ portfolioID ]);
        return { page: workData };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestImages = async (portfolioID) => {
    try {
        const query = `
            SELECT ideaID, ideaImage, ideaTitle,
                (   
                    SELECT COUNT(*) FROM portfolio 
                    WHERE portfolio.workImage = ideas.ideaID
                ) as isCurrent
            FROM ideas WHERE portfolioID = ?
        `;
        return { images: await DB(query, [ portfolioID ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCreators = async () => {
    try {
        const query = `SELECT creatorID, creatorName FROM portfolio_creators`;
        return { creators: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateWork = async (requestData, hasFilters = false) => {
    const { portfolioID, portfolioImages, filterArray, ...updateData } = requestData;
    try {
        const query = `UPDATE portfolio SET ? WHERE portfolioID = ?`;
        const response = await DB(query, [updateData, portfolioID]);
        if (hasFilters) {
            const deleteQuery = `DELETE FROM portfolio_properties WHERE portfolioID = ?`;
            await DB(deleteQuery, [portfolioID]);
            let filters = [];
            if (typeof filterArray === `string`) filters.push(filterArray);
            if (typeof filterArray === `object`) filters = [ ...filterArray ];
            for (const filterID of filters) {
                const relationData = { portfolioID, filterID };
                const query = `INSERT INTO portfolio_properties SET ?`;
                await DB(query, relationData);
            }
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(portfolioID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(portfolioID), error };
    }
};

const updateCreator = async ({ creatorID, ...updateData }) => {
    try {
        const query = `UPDATE portfolio_creators SET ? WHERE creatorID = ?`;
        const response = await DB(query, [updateData, creatorID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(creatorID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(creatorID), error };
    }
};

// DELETE

const deleteWork = async (portfolioID) => {
    try {
        const query = `DELETE FROM portfolio WHERE portfolioID = ?`;
        const response = await DB(query, [portfolioID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(portfolioID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(portfolioID), error };
    }
};

const deleteCreator = async ({ creatorID }) => {
    try {
        const query = `DELETE FROM portfolio_creators WHERE creatorID = ?`;
        const response = await DB(query, [creatorID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(creatorID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(creatorID), error };
    }
};

module.exports = {
    createWork, addCreator, requestFilteredPortfolio, requestPortfolio, requestHomePortfolio, requestWork,
    requestWorkByLink, requestImages, requestCreators, updateWork, updateCreator,
    deleteWork, deleteCreator
};