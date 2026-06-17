import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, Email, Subject, and Message are required' });
    }

    // Sanitize and validate length
    const sanitizedName = String(name).trim();
    const sanitizedEmail = String(email).trim();
    const sanitizedSubject = String(subject).trim();
    const sanitizedMessage = String(message).trim();
    
    if (sanitizedMessage.length > 5000) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 5000 characters' });
    }
    
    if (sanitizedSubject.length > 200) {
      return res.status(400).json({ error: 'Subject exceeds maximum length of 200 characters' });
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const date = new Date().toISOString();

    const emailBody = `
--------------------------------

New Contact Request

Name:
${sanitizedName}

Email:
${sanitizedEmail}

Phone:
${phone ? String(phone).trim() : 'N/A'}

Company:
${company ? String(company).trim() : 'N/A'}

Subject:
${sanitizedSubject}

--------------------------------

Message

${sanitizedMessage}

--------------------------------

Submitted At:
${date}

IP:
${ip}

--------------------------------
`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ro224313@gmail.com',
      subject: `🚀 New Contact Form Submission: ${sanitizedSubject}`,
      text: emailBody,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully."
    });

  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}
