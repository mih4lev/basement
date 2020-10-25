const nodemailer = require('nodemailer');
const hbsNodemailer = require('nodemailer-express-handlebars');

const createTransport = () => {
    try {
        const hbsOptions = {
            viewEngine: {
                extname: '.hbs',
                layoutsDir: 'views/layouts/',
                defaultLayout : 'mail-template',
                partialsDir : 'views/partials/'
            },
            viewPath: 'views/email/',
            extName: '.hbs'
        };
        const transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: "sales@artegallery.ru",
                pass: "arte2020sales"
            }
        });
        transporter.use('compile', hbsNodemailer(hbsOptions));
        return transporter;
    } catch (error) {
        return console.log('Error: ' + error.name + ":" + error.message);
    }
};

const sendClientMail = async (sendData, templateName, clientMail) => {
    try {
        let mailOptions = {
            // from: `BasementRemodeling.com contacts@basementremodeling.com`,
            from: `BasementRemodeling.com sales@artegallery.ru`,
            to: clientMail,
            subject: `Thank you for submitting your request`,
            template: templateName,
            context: sendData
        };
        await createTransport().sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};

const sendOwnerMail = async (sendData, templateName) => {
    try {
        let mailOptions = {
            // from: `BasementRemodeling.com contacts@basementremodeling.com`,
            from: `BasementRemodeling.com sales@artegallery.ru`,
            // to: `contacts@basementremodeling.com`,
            to: `andevme@gmail.com`,
            subject: `New request from site`,
            template: templateName,
            context: sendData
        };
        await createTransport().sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { sendClientMail, sendOwnerMail };