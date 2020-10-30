const nodemailer = require('nodemailer');
const hbsNodemailer = require('nodemailer-express-handlebars');

const { singleDB } = require("./db.model");

const requestMailSettings = async () => {
    try {
        const query = `
            SELECT 
                mailHost, mailPort, mailSecure, authUser, authPassword, 
                emailFrom, emailSubject, sendEmail, adminSubject
            FROM settings
        `;
        return { ...(await singleDB(query)) };
    } catch (error) {
        console.log(error);
        return {};
    }
};

const createTransport = (transportData) => {
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
        const { mailHost, mailPort, mailSecure, authUser, authPassword } = transportData;
        const transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: mailSecure,
            auth: {
                user: authUser,
                pass: authPassword
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
        const mailData = await requestMailSettings();
        const { emailFrom, emailSubject, ...transportData } = mailData;
        let mailOptions = {
            from: emailFrom,
            to: clientMail,
            subject: emailSubject,
            template: templateName,
            context: sendData
        };
        await createTransport(transportData).sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};

const sendOwnerMail = async (sendData, templateName) => {
    try {
        const mailData = await requestMailSettings();
        const { emailFrom, sendEmail, adminSubject, ...transportData } = mailData;
        let mailOptions = {
            from: emailFrom,
            to: sendEmail,
            subject: adminSubject,
            template: templateName,
            context: sendData
        };
        await createTransport(transportData).sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { requestMailSettings, sendClientMail, sendOwnerMail };