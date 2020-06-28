const uploadIdeas = async (request, response) => {
    const formData = { ...request.body, files: request.files};
    console.log(formData);
    const data = { code: 200, albumID: 10 };
    setTimeout(() => response.json(data), 1000);
};

module.exports = {
    uploadIdeas
};