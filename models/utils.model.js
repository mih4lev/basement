const crypto = require(`crypto`);

const requestContent = (resolvedData) => {
    const content = {};
    resolvedData.forEach((value) => {
        content[Object.keys(value)] = value[Object.keys(value)];
    });
    return content;
};

const generateSalt = function(length){
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const getCryptoPassword = (password, salt) => {
    const hash = crypto.createHmac(`sha512`, salt);
    hash.update(password);
    const value = hash.digest(`hex`);
    return { salt: salt, password: value };
};

module.exports = { requestContent, generateSalt, getCryptoPassword };