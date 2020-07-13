const FS = require(`fs`);
const fetch = require(`node-fetch`);

const requestData = async () => {
    try {
        const instagramJSON = await fetch(`https://www.instagram.com/basement_remodeling_com/?__a=1`);
        const saveData = await instagramJSON.json();
        FS.writeFileSync("data-mock/instagram.json", JSON.stringify(saveData));
    } catch (error) {
        console.log(error);
    }
};

setInterval(requestData, 60 * 60 * 1000);