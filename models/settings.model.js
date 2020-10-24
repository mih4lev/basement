const { DB, singleDB } = require("./db.model");

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

const updateSettings = async ({ settingID, ...updateData }) => {
    try {
        const query = `UPDATE settings SET ? WHERE settingID = ?`;
        const response = await DB(query, [ updateData, settingID ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(settingID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(settingID), error };
    }
};

module.exports = { requestSettingsData, updateSettings };