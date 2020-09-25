const fs = require(`fs-extra`);
const { google } = require('googleapis');

const SCOPES = [`https://www.googleapis.com/auth/calendar`];
const CREDENTIAL = `credentials.json`;
const tokensFolder = `tokens/`;

// REQUEST user auth link
const requestAuthURL = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const credentials = await fs.readJson(CREDENTIAL);
            const { client_id, client_secret, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            const authUrl = oAuth2Client.generateAuthUrl({ access_type: `online`, scope: SCOPES });
            resolve({ status: 1, link: authUrl });
        } catch (error) {
            resolve({ status: 0, error });
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
                        if (error) resolve({ status: 0, error });
                        await fs.writeJson(tokenPath, token);
                        resolve({ status: 1, data: tokenPath });
                    } catch (error) {
                        resolve({ status: 0, error })
                    }
                };
            };
            oAuth2Client.getToken(authCode, tokenCallback(tokenPath));
        } catch (error) {
            resolve({ status: 0, error })
        }
    });
};

const tokensCallback = (tokens) => {
    if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
};

// REQUEST oath authorization
const authCalendar = async (userToken) => {
    try {
        const credentials = await fs.readJson(CREDENTIAL);
        const { client_id, client_secret, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.on(`tokens`, tokensCallback);
        const token = await fs.readJson(userToken);
        oAuth2Client.setCredentials(token);
        return google.calendar({ version: 'v3', auth: oAuth2Client });
    } catch (error) {
        throw Error(error);
    }
};

// REQUEST calendar list
const requestCalendar = async (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userToken = tokensFolder + userID + `.json`;
            const calendar = await authCalendar(userToken);
            const timeMin = (new Date()).toISOString();
            const requestData = { calendarId: `primary`, timeMin, singleEvents: true };
            const requestCalendarHandler = (error, result) => {
                if (error) resolve({ status: 0, error });
                resolve({ status: 1, data: result.data.items });
            };
            calendar.events.list(requestData, requestCalendarHandler);
        } catch (error) {
            console.log(error);
            const errorMessage = error.toString();
            resolve({ status: 0, error: errorMessage });
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
                if (error) resolve({ status: 0, error });
                resolve({ status: 1, data: event });
            };
            await calendar.events.insert(addData, addEventHandler);
        } catch (error) {
            resolve({ status: 0, error });
        }
    });
};

module.exports = {
    requestAuthURL, createAccessToken, requestCalendar, addEvent
};