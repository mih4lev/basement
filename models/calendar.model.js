const fs = require(`fs-extra`);
const { google } = require('googleapis');

const SCOPES = [`https://www.googleapis.com/auth/calendar`];
const CREDENTIAL = `credentials.json`;

// REQUEST user auth link
const requestAuthURL = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const credentials = await fs.readJson(CREDENTIAL);
            const { client_id, client_secret, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            const authUrl = oAuth2Client.generateAuthUrl({ access_type: `offline`, scope: SCOPES });
            resolve({ status: 1, data: authUrl });
        } catch (error) {
            reject({ status: 0, error });
        }
    });
};

// CREATE user access token
const createAccessToken = (authCode, tokenPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const credentials = await fs.readJson(CREDENTIAL);
            const { client_id, client_secret, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            const tokenCallback = (tokenPath) => {
                return async (error, token) => {
                    try {
                        if (error) reject({ status: 0, error })
                        await fs.writeJson(tokenPath, token);
                        resolve({ status: 1, data: tokenPath });
                    } catch (error) {
                        reject({ status: 0, error })
                    }
                };
            };
            oAuth2Client.getToken(authCode, tokenCallback(tokenPath));
        } catch (error) {
            reject({ status: 0, error })
        }
    });
};

// REQUEST oath authorization
const authCalendar = async (userToken) => {
    try {
        const credentials = await fs.readJson(CREDENTIAL);
        const { client_id, client_secret, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        const token = await fs.readJson(userToken);
        oAuth2Client.setCredentials(token);
        return google.calendar({ version: 'v3', auth: oAuth2Client });
    } catch (error) {
        console.log(error);
    }
};

// REQUEST calendar list
const requestCalendar = async (userToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const calendar = await authCalendar(userToken);
            const timeMin = (new Date()).toISOString();
            const requestData = { calendarId: `primary`, timeMin, singleEvents: true };
            const requestCalendarHandler = (error, result) => {
                if (error) reject({ status: 0, error });
                resolve({ status: 1, data: result.data.items });
            };
            calendar.events.list(requestData, requestCalendarHandler);
        } catch (error) {
            reject({ status: 0, error });
        }
    });
};

// ADD event to calendar
const addEvent = (eventData, userToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const calendar = await authCalendar(userToken);
            const addData = { calendarId: `primary`, resource: eventData };
            const addEventHandler = (error, event) => {
                if (error) reject({ status: 0, error });
                resolve({ status: 1, data: event });
            };
            await calendar.events.insert(addData, addEventHandler);
        } catch (error) {
            reject({ status: 0, error });
        }
    });
};

module.exports = {
    requestAuthURL, createAccessToken, requestCalendar, addEvent
};