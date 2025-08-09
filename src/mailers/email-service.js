const fs = require("fs");
const path = require("path");
const transporter = require("../../config/mailer");

const generateTemplate = (templateName, data, format) => {
  const filePath = path.join(__dirname, `./mails/${templateName}.${format}`);
  let template = fs.readFileSync(filePath, "utf-8");

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const regex = new RegExp(`{${key}}`, "g");
    template = template.replace(regex, value);
  });
  return template;
};

const sendEmail = (email, subject, templateName, data) => {
  const html = generateTemplate(templateName, data, "html");
  const text = generateTemplate(templateName, data, "txt");

  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject,
    html,
    text,
  });
};

module.exports = sendEmail;
