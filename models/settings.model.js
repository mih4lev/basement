const { singleDB } = require("./db.model");

const requestSettingsData = async () => {
    try {
        const query = `
            SELECT 
                phoneMain, phoneMD1, phoneMD2, phoneVA, phoneDC, address, email, 
                sendEmail, workDays, workTime, closedTime, linkInstagram, linkFacebook, 
                linkPinterest, angiesListLink, houzzLink, googleLink, facebookLink, 
                porchLink, homeAdvisorLink, copyrightText
            FROM settings
        `;
        return { ...(await singleDB(query)) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestSettingsData };