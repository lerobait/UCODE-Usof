import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: Number(process.env.BREVO_PORT),
    auth: {
      user: process.env.BREVO_LOGIN,
      pass: process.env.BREVO_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: 'artem.nikulin.0526@gmail.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
};

export default sendEmail;
