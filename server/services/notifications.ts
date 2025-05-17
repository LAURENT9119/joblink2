
import twilio from 'twilio';
import { User, Job } from '@shared/schema';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(to: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
  } catch (error) {
    console.error('SMS sending failed:', error);
  }
}

export async function sendWhatsApp(to: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      to: `whatsapp:${to}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
    });
  } catch (error) {
    console.error('WhatsApp sending failed:', error);
  }
}
