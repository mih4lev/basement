//
const checkRequestData = (requestData) => {
    let {
        firstName, lastName, email, phone, zipCode, service, message,
        consultationTime, developStart, budget, referer
    } = requestData;
    // service
    if (typeof service === `object`) service = service.join(`, `);
    // return object
    return {
        firstName, lastName, email, phone, zipCode, service, message,
        consultationTime, developStart, budget, referer
    };
};

// instant quote form
const checkQuoteData = (requestData) => {
    let {
        firstName, lastName, email, square, zipCode, bathroomExist,
        demolitionRequired, kitchenExist, isHeightOver, referer
    } = requestData;
    // return object
    return {
        firstName, lastName, email, square, zipCode, bathroomExist,
        demolitionRequired, kitchenExist, isHeightOver, referer
    };
};

module.exports = { checkRequestData, checkQuoteData };