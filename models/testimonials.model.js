const { DB, singleDB } = require("./db.model");

// CREATE

const createTestimonial = async (pageData) => {
    try {
        const query = `INSERT INTO testimonials SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        console.log(error);
        return { status: 0, error };
    }
};

// REQUEST

const requestTestimonials = async ({ limit = 100000 } = {}) => {
    try {
        const query = `
            SELECT testimonialID, testimonialAuthor, testimonialImage, testimonialState, testimonialRating, 
                   testimonialAnnounce, DATE_FORMAT(timestamp, "%m/%d/%Y") AS testimonialDate 
            FROM testimonials ORDER BY timestamp DESC LIMIT ?
        `;
        return { testimonials: await DB(query, [ limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestTestimonial = async (testimonialID) => {
    try {
        const query = `
            SELECT *, DATE_FORMAT(timestamp, "%m/%d/%Y") AS testimonialDate  
            FROM testimonials WHERE testimonialID = ?
        `;
        return { page: await singleDB(query, [testimonialID]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const requestTestimonialsCount = async ({ limit }) => {
    try {
        const query = `
            SELECT 
                COUNT(testimonialID) as testimonialsCount, 
                IF (COUNT(testimonialID) > ?, 0, 1) as hiddenButton FROM testimonials
        `;
        return { testimonialsData: await singleDB(query, [ limit ]) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

// UPDATE

const updateTestimonial = async ({ testimonialID, ...updateData }) => {
    try {
        const query = `UPDATE testimonials SET ? WHERE testimonialID = ?`;
        const response = await DB(query, [updateData, testimonialID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(testimonialID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(testimonialID), error };
    }
};

// DELETE

const deleteTestimonial = async (testimonialID) => {
    try {
        const query = `DELETE FROM testimonials WHERE testimonialID = ?`;
        const response = await DB(query, [testimonialID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(testimonialID) };
    } catch (error) {
        console.log(error);
        return { status: 0, requestID: Number(testimonialID), error };
    }
};

module.exports = {
    createTestimonial, requestTestimonials, requestTestimonial, requestTestimonialsCount,
    updateTestimonial, deleteTestimonial
};