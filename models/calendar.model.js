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
            const authUrl = oAuth2Client.generateAuthUrl({ access_type: `offline`, scope: SCOPES });
            resolve({ status: 1, link: authUrl });
        } catch (error) {
            resolve({ status: 0, error: error.toString() });
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
                        if (error) resolve({ status: 0, error: error.toString() });
                        await fs.writeJson(tokenPath, token);
                        resolve({ status: 1, data: tokenPath });
                    } catch (error) {
                        resolve({ status: 0, error: error.toString() })
                    }
                };
            };
            oAuth2Client.getToken(authCode, tokenCallback(tokenPath));
        } catch (error) {
            resolve({ status: 0, error: error.toString() })
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
                if (error) resolve({ status: 0, error: error.toString() });
                resolve({ status: 1, data: result.data.items });
            };
            calendar.events.list(requestData, requestCalendarHandler);
        } catch (error) {
            resolve({ status: 0, error: error.toString() });
        }
    });
};

const createEventData = (formData) => {
    const {
        firstName, lastName, phone, email, square, budget, state, zipCode, date,
        service, address, town, message, referer
    } = formData;
    const startDate = new Date(Number(date));
    const endDate = new Date(Number(date));
    startDate.setHours(startDate.getHours() - 1);
    endDate.setHours(endDate.getHours() + 2);
    return {
        summary: `${firstName} ${lastName}`,
        location: `${address}, ${town}, ${state}, ${zipCode}`,
        description: `
        Phone: ${phone}
        Basement square: ${square} SQ. FT.
        Budget price: ${budget}
        Comment: ${message}
        Service: ${service}
        Referer: ${referer}
    `,
        start: {
            dateTime: startDate.toISOString(),
            timeZone: `Europe/Moscow`
            // timeZone: `America/New_York`
        },
        end: {
            dateTime: endDate.toISOString(),
            timeZone: `Europe/Moscow`
            // timeZone: `America/New_York`
        },
        attendees: [
            { email: `${email}` }
        ],
        reminders: {
            useDefault: true
        }
    };
};

// ADD event to calendar
const addEvent = (formData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { spec } = formData;
            const userToken = `tokens/${spec}.json`;
            const calendar = await authCalendar(userToken);
            const eventData = createEventData(formData);
            const addData = { calendarId: `primary`, resource: eventData };
            const addEventHandler = (error, event) => {
                if (error) resolve({ status: 0, error: error.toString() });
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