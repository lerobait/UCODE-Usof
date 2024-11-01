import nodemailer from 'nodemailer';
import { create } from 'express-handlebars';
import path from 'path';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string | number | boolean>;
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

  const hbs = create({
    extname: '.hbs',
    layoutsDir: path.resolve(process.cwd(), 'src/views/emails/layouts'),
    defaultLayout: 'main',
  });

  transporter.use(
    'compile',
    nodemailerExpressHandlebars({
      viewEngine: hbs,
      viewPath: path.resolve(process.cwd(), 'src/views/emails'),
      extName: '.hbs',
    }),
  );

  await transporter.sendMail({
    from: 'artem.nikulin.0526@gmail.com',
    to: options.to,
    subject: options.subject,
    template: options.template,
    context: options.context,
  } as nodemailer.SendMailOptions);
};

export default sendEmail;
