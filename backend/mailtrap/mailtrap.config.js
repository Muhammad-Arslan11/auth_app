import {MailtrapClient} from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
