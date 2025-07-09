import { MailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await MailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("verificationCode", verificationToken),
            category: "Email verification",
        });

        console.log("email sent successfully", response);
    } catch (error) {
      throw new Error(`Error sending email: "${error}` );
    }
}