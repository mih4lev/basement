const { DB } = require("./db.model");

// CREATE

const createIdeasFilter = async (pageData) => {
    try {
        const query = `
            INSERT INTO ideas_filters SET ?, 
            position = (
                SELECT filters.position FROM ideas_filters as filters 
                ORDER BY filters.filterID DESC LIMIT 1
            ) + 1
        `;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

const createPortfolioFilter = async (pageData) => {
    try {
        const query = `
            INSERT INTO portfolio_filters SET ?, 
            position = (
                SELECT filters.position FROM portfolio_filters as filters 
                ORDER BY filters.filterID DESC LIMIT 1
            ) + 1
        `;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

// REQUEST

const requestIdeasFilters = async (ideaID = 0) => {
    try {
        const query = `
            SELECT 
                ideas_filters.filterID, ideas_filters.filterTitle, 
                ideas_filters.filterColor, ideas_filters.parentID,
                IF (ideas_filters.parentID IS NULL, 1, 2) as filterLevel,
                IF(
                    (
                        SELECT COUNT(*) FROM ideas_filters as childFilters 
                        WHERE 
                            ideas_filters.filterID = childFilters.parentID && 
                            childFilters.filterColor IS NOT NULL
                    ) > 0, 1, 0
                ) as isColor,
                (
                    SELECT COUNT(ideas_properties.relationID)
                    FROM ideas_properties
                    WHERE ideas_properties.ideaID = ? && ideas_properties.filterID = ideas_filters.filterID
                ) as isChosen
            FROM ideas_filters
            ORDER BY ideas_filters.position
        `;
        const filtersData = await DB(query, [ideaID]);
        const filters = [];
        filtersData.forEach((filter) => {
            const { filterLevel, filterID } = filter;
            if (filterLevel === 2) return false;
            filter.children = [];
            filtersData.forEach((childFilter) => {
                const { filterLevel, parentID } = childFilter;
                if (filterLevel === 1 || filterID !== parentID) return false;
                filter.children.push(childFilter);
            });
            filters.push(filter);
        });
        return { filters };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestPortfolioFilters = async (portfolioID = 0) => {
    try {
        const query = `
            SELECT 
                portfolio_filters.filterID, portfolio_filters.filterTitle, 
                portfolio_filters.filterColor, portfolio_filters.parentID,
                IF (portfolio_filters.parentID IS NULL, 1, 2) as filterLevel,
                IF(
                    (
                        SELECT COUNT(*) FROM portfolio_filters as childFilters 
                        WHERE 
                            portfolio_filters.filterID = childFilters.parentID && 
                            childFilters.filterColor IS NOT NULL
                    ) > 0, 1, 0
                ) as isColor,
                (
                    SELECT COUNT(portfolio_properties.relationID)
                    FROM portfolio_properties
                    WHERE portfolio_properties.portfolioID = ? && 
                          portfolio_properties.filterID = portfolio_filters.filterID
                ) as isChosen
            FROM portfolio_filters
            ORDER BY portfolio_filters.position
        `;
        const filtersData = await DB(query, [portfolioID]);
        const filters = [];
        filtersData.forEach((filter) => {
            const { filterLevel, filterID } = filter;
            if (filterLevel === 2) return false;
            filter.children = [];
            filtersData.forEach((childFilter) => {
                const { filterLevel, parentID } = childFilter;
                if (filterLevel === 1 || filterID !== parentID) return false;
                filter.children.push(childFilter);
            });
            filters.push(filter);
        });
        return { filters };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateIdeasFilter = async ({ filterID, ...updateData }) => {
    try {
        const query = `UPDATE ideas_filters SET ? WHERE filterID = ?`;
        const response = await DB(query, [updateData, filterID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(filterID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(filterID), error };
    }
};

const updatePortfolioFilter = async ({ filterID, ...updateData }) => {
    try {
        const query = `UPDATE portfolio_filters SET ? WHERE filterID = ?`;
        const response = await DB(query, [updateData, filterID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(filterID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(filterID), error };
    }
};

// DELETE

const deleteIdeasFilter = async (filterID) => {
    try {
        const query = `DELETE FROM ideas_filters WHERE filterID = ?`;
        const response = await DB(query, [filterID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(filterID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(filterID), error };
    }
};

const deletePortfolioFilter = async (filterID) => {
    try {
        const query = `DELETE FROM portfolio_filters WHERE filterID = ?`;
        const response = await DB(query, [filterID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(filterID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(filterID), error };
    }
};

module.exports = {
    createIdeasFilter, createPortfolioFilter, requestIdeasFilters, requestPortfolioFilters,
    updateIdeasFilter, updatePortfolioFilter, deleteIdeasFilter, deletePortfolioFilter
};