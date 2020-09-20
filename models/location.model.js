const { DB } = require("./db.model");

const requestLocation = async () => {
    try {
        const query = `
            SELECT 
                location_categories.categoryTitle, location.locationTitle, 
                location.locationCounties
            FROM location_categories 
            LEFT JOIN location ON location_categories.categoryID = location.categoryID
        `;
        const response = await DB(query);
        const locationMap = ({ categoryTitle }) => categoryTitle;
        const locationCategories = [...(new Set(response.map(locationMap)))];
        const location = [];
        locationCategories.forEach((category) => {
            const counties = [];
            location.push({ category, counties })
        });
        response.forEach(({ categoryTitle, locationTitle, locationCounties }) => {
            const findFunc = ({ category }) => category === categoryTitle;
            const categoryIndex = location.findIndex(findFunc);
            if (!locationTitle) return false;
            const countyData = { locationTitle, locationCounties }
            location[categoryIndex].counties.push(countyData);
        });
        return { location };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestLocation };