import mailgun from 'mailgun-js';

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

const sendEmail = async ({ to, subject, text, html }) => {
  const data = {
    from: process.env.FROM_EMAIL, // Your verified sender email
    to,
    subject,
    text,
    html,
  };

  try {
    await mg.messages().send(data);
  } catch (error) {
    console.error('Error sending email', error);
    throw new Error('Failed to send email');
  }
};