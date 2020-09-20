const fs = require(`fs`);

const requestInstagram = async () => {
    try {
        const instagramJSON = fs.readFileSync(`data-mock/instagram.json`);
        return { instagram: JSON.parse(instagramJSON) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

module.exports = { requestInstagram };