const { DB, singleDB } = require("./db.model");

// CREATE

const createCategory = async (pageData) => {
    try {
        const query = `
            INSERT INTO ideas_categories SET ?, 
            position = (
                SELECT position FROM ideas_categories as categories
                ORDER BY categories.categoryID DESC LIMIT 1
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

const requestMainCategories = async () => {
    try {
        const query = `
            SELECT
                ideas_categories.categoryTitle, ideas_categories.categoryLink,
                ideas_categories.categoryImage
            FROM ideas_categories
            WHERE ideas_categories.categoryLevel = 0
            ORDER BY ideas_categories.position
        `;
        return { categories: await DB(query) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategories = async (ideaID = 0) => {
    try {
        const query = `
            SELECT *, 
                (
                    SELECT COUNT(ideas_categories.categoryID) 
                    FROM ideas_categories 
                    WHERE ideas_categories.categoryParent = categories.categoryID
                ) as categoryChildren,
                ( 
                    SELECT COUNT(ideas_relation.relationID)
                    FROM ideas_relation
                    WHERE ideas_relation.categoryID = categories.categoryID
                ) as categoryIdeas,
                (
                    SELECT COUNT(ideas_relation.relationID)
                    FROM ideas_relation
                    WHERE ideas_relation.ideaID = ? && ideas_relation.categoryID = categories.categoryID
                ) as isChosen,
                (
                    SELECT COUNT(cats.categoryID)
                    FROM ideas_categories AS cats
                    JOIN ideas ON ideas.similarID = cats.categoryID
                    WHERE 
                        cats.categoryID = ideas.similarID && 
                        cats.categoryID = categories.categoryID &&
                        ideas.ideaID = ?
                ) as isSimilar
            FROM ideas_categories AS categories
            ORDER BY position
        `;
        const response = await DB(query, [ideaID, ideaID]);
        const categories = [];
        // edit children categories
        response.forEach((category) => {
            const { categoryID, categoryLevel } = category;
            if (categoryLevel !== 0) return false;
            category.children = [];
            response.forEach((secondCategory) => {
                const { categoryID: childID, categoryParent, categoryChildren } = secondCategory;
                if (categoryParent !== categoryID) return false;
                secondCategory.isActive = categoryChildren === 0;
                secondCategory.children = [];
                response.forEach((thirdCategory) => {
                    const { categoryParent, categoryChildren } = thirdCategory;
                    if (categoryParent !== childID) return false;
                    thirdCategory.isActive = categoryChildren === 0;
                    secondCategory.children.push(thirdCategory);
                });
                category.children.push(secondCategory);
            });
            categories.push(category);
        });
        return { categories };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestSubCategories = async (searchData, isURL, currentURL) => {
    try {
        const queryID = `
            SELECT 
                ideas_categories.categoryTitle, ideas_categories.categoryImage,
                IF (ideas_categories.categoryID = ?, true, false) AS isActive,
                CONCAT(
                    '/basement-ideas/', 
                    IF (mainCategories.categoryLink IS NOT NULL, mainCategories.categoryLink, ''),
                    IF (mainCategories.categoryLink IS NOT NULL, '/', ''),
                    IF (parentCategories.categoryLink IS NOT NULL, parentCategories.categoryLink, ''),
                    IF (parentCategories.categoryLink IS NOT NULL, '/', ''),
                    ideas_categories.categoryLink, '/'
                ) as categoryLink
            FROM ideas_categories 
            LEFT JOIN ideas_categories as parentCategories 
                ON ideas_categories.categoryParent = parentCategories.categoryID
            LEFT JOIN ideas_categories as mainCategories 
                ON parentCategories.categoryParent = mainCategories.categoryID
            WHERE ideas_categories.categoryParent = ? 
            ORDER BY ideas_categories.position
        `;
        const queryURL = `
            SELECT 
                ideas_categories.categoryTitle, ideas_categories.categoryImage,
                IF (ideas_categories.categoryLink = ?, true, false) AS isActive,
                CONCAT(
                    '/basement-ideas/', 
                    IF (mainCategories.categoryLink IS NOT NULL, mainCategories.categoryLink, ''),
                    IF (mainCategories.categoryLink IS NOT NULL, '/', ''),
                    IF (parentCategories.categoryLink IS NOT NULL, parentCategories.categoryLink, ''),
                    IF (parentCategories.categoryLink IS NOT NULL, '/', ''),
                    ideas_categories.categoryLink, '/'
                ) as categoryLink
            FROM ideas_categories 
            LEFT JOIN ideas_categories as parentCategories 
                ON ideas_categories.categoryParent = parentCategories.categoryID
            LEFT JOIN ideas_categories as mainCategories 
                ON parentCategories.categoryParent = mainCategories.categoryID
            WHERE ideas_categories.categoryParent = (
                SELECT ideas_categories.categoryID FROM ideas_categories 
                WHERE ideas_categories.categoryLink = ?
            ) 
            ORDER BY ideas_categories.position
        `;
        const query = (isURL) ? queryURL : queryID;
        return { subCategories: await DB(query, [currentURL, searchData]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategory = async (searchData, isURL) => {
    try {
        const query = `
            SELECT categoryID, categoryTitle, categoryLink, categoryImage 
            FROM ideas_categories WHERE ?? = ?
            ORDER BY position
        `;
        const params = (isURL) ? [`categoryLink`, searchData] : [`categoryID`, searchData];
        return { category: await singleDB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestSubCategory = async (searchData, isURL) => {
    try {
        const query = `
            SELECT categoryID, categoryTitle, categoryLink, categoryImage 
            FROM ideas_categories WHERE ?? = ?
            ORDER BY position
        `;
        const params = (isURL) ? [`categoryLink`, searchData] : [`categoryID`, searchData];
        return { subCategory: await singleDB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestChildCategory = async (searchData, isURL) => {
    try {
        const query = `
            SELECT categoryID, categoryTitle, categoryLink, categoryImage
            FROM ideas_categories WHERE ?? = ?
            ORDER BY position
        `;
        const params = (isURL) ? [`categoryLink`, searchData] : [`categoryID`, searchData];
        return { childCategory: await singleDB(query, params) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategoryIDData = async (categoryID) => {
    try {
        const query = `
            SELECT COUNT(*) AS ideasCount, IF (COUNT(*) <= 12, 1, 0) as hiddenButton
            FROM (
                SELECT ideas.ideaID
                FROM ideas_relation 
                LEFT JOIN ideas_categories ON ideas_relation.categoryID = ideas_categories.categoryID 
                LEFT JOIN ideas_categories AS cat1 ON ideas_categories.categoryParent = cat1.categoryID 
                lEFT JOIN ideas_categories AS cat2 ON cat1.categoryParent = cat2.categoryID 
                LEFT JOIN ideas ON ideas.ideaID = ideas_relation.ideaID 
                WHERE (
                    cat2.categoryID = ? || cat1.categoryID = ? || ideas_categories.categoryID = ? 
                ) && ideas.isModerated = 1
                GROUP BY ideas.ideaID
            ) AS ideasTable
        `;
        return { categoryData: await singleDB(query, [categoryID, categoryID, categoryID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestCategoryURLData = async (categoryURL) => {
    try {
        const query = `
            SELECT COUNT(*) AS ideasCount, IF (COUNT(*) <= 12, 1, 0) as hiddenButton
            FROM (
                SELECT ideas.ideaID
                FROM ideas_relation 
                LEFT JOIN ideas_categories ON ideas_relation.categoryID = ideas_categories.categoryID 
                LEFT JOIN ideas_categories AS cat1 ON ideas_categories.categoryParent = cat1.categoryID 
                lEFT JOIN ideas_categories AS cat2 ON cat1.categoryParent = cat2.categoryID 
                LEFT JOIN ideas ON ideas.ideaID = ideas_relation.ideaID 
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
            ) AS ideasTable
        `;
        return { categoryData: await singleDB(query, [categoryURL, categoryURL, categoryURL]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateCategory = async ({ categoryID, ...updateData }) => {
    try {
        const query = `UPDATE ideas_categories SET ? WHERE categoryID = ?`;
        const response = await DB(query, [updateData, categoryID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(categoryID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(categoryID), error };
    }
};

// DELETE

const deleteCategory = async (categoryID) => {
    try {
        const query = `DELETE FROM ideas_categories WHERE categoryID = ?`;
        const response = await DB(query, [categoryID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(categoryID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(categoryID), error };
    }
};

module.exports = {
    createCategory, requestCategories, requestMainCategories, requestSubCategories,
    requestCategory, requestSubCategory, requestChildCategory, requestCategoryIDData,
    requestCategoryURLData, updateCategory, deleteCategory
};