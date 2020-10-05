const checkBookingData = (requestData) => {
    let {
        date, spec, firstName, lastName, phone, email, address, town,
        state, zipCode, service, square, budget, message
    } = requestData;
    // service
    if (typeof service === `object`) service = service.join(`, `);
    // return object
    return {
        date, spec, firstName, lastName, phone, email, address, town,
        state, zipCode, service, square, budget, message
    };
};

module.exports = { checkBookingData };