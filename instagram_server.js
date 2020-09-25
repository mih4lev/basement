const FS = require(`fs`);
const fetch = require(`node-fetch`);

const fields = `media_type,media_url,thumbnail_url,permalink`;
const limit = 6;
const APIKey = `IGQVJXSTNSZA3hUVUdKN0oxTXRfMktrSmhXdGV5ZAkl3ak80RWQ2YTBQVGpScW1fczVsY0FNVXN6eUg5Tk9wYnNoVlBZAWmRJdnVLSWNqV3o3ODlHaWl0Um4ydnV3d3BMZAUVfeWc1TnRWa2tSUTVzVUJoOQZDZD`;
const instagramURL = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${APIKey}`;

const requestData = async () => {
    try {
        console.log(`preparing...`);
        const instagramJSON = await fetch(instagramURL);
        const instagramData = await instagramJSON.json();
        const mapFunc = ({ media_type, media_url, permalink, thumbnail_url }) => {
            const thumbnail = (media_type === `VIDEO`) ? thumbnail_url : media_url;
            return { thumbnail, link: permalink };
        };
        const saveData = instagramData.data.map(mapFunc);
        FS.writeFileSync("data-mock/instagram.json", JSON.stringify(saveData));
        console.log(`...saved`);
    } catch (error) {
        console.log(error);
    }
};
requestData();
setInterval(requestData, 15 * 60 * 1000);