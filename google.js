const {
    requestAuthURL, createAccessToken, requestCalendar, addEvent
} = require("./models/calendar.model");

const userToken = `tokens/token.json`;

const eventData = {
    summary: `Andrei Mikhalev`,
    location: `18008 Coachmans Rd, Germantown, MD, 20874`,
    description: `
        Basement square: 1200 SQ. FT.
        Budget price: 40000$
        Comment: comment text...
    `,
    start: {
        dateTime: `2020-09-24T13:00:00-04:00`,
        timeZone: `America/New_York`
    },
    end: {
        dateTime: `2020-09-24T16:00:00-04:00`,
        timeZone: `America/New_York`
    },
    attendees: [
        { email: `ilante@yandex.ru` }
    ],
    reminders: {
        useDefault: true
    }
};

const newEvent = async () => {
    const event = await addEvent(eventData, userToken);
    console.log(event);
};
// newEvent();

const calendar = async () => {
    const events = await requestCalendar(userToken);
    events.data.forEach((event) => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        console.log(`${start} - ${end} | ${event.summary}`);
    });
};
calendar();

const authURL = async () => {
    const data = await requestAuthURL();
    console.log(data);
};
// authURL();

const createToken = async () => {
    const authCode = `4/4gHIJqhI85KxGj-ULIeMdam270t6CI-wfVoanFbH3ZBjpP3C4C3gJkg`;
    const data = await createAccessToken(authCode, userToken);
    console.log(data);
};
// createToken();