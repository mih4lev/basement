const { requestSettingsData } = require("../models/settings.model");

const requestSettings = async (request, response, next) => {
    try {
        const settingsData = await requestSettingsData();
        request.data = { ...request.data, ...settingsData };
        next();
    } catch (error) {
        console.log(error);
        next();
    }
};

module.exports = requestSettings;